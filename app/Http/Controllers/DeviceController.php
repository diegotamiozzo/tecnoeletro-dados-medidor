<?php

namespace App\Http\Controllers;

use App\Models\Device;
use App\Models\DeviceInvite;
use App\Models\User;
use App\Models\DadoAgregado;
use App\Notifications\DeviceInviteNotification;
use App\Jobs\AggregateDashboardData;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Notification;
use Illuminate\Validation\Rule;
use Symfony\Component\HttpFoundation\StreamedResponse;

class DeviceController extends Controller
{
    private function findDevice($id): Device
    {
        if (auth()->user()->is_admin) {
            return Device::findOrFail($id);
        }
        return auth()->user()->devices()->findOrFail($id);
    }

    public function index()
    {
        $devices = auth()->user()->devices()
            ->with(['users' => function($query) {
                $query->where('users.id', '!=', auth()->id());
            }])
            ->get();

        return Inertia::render('devices', ['devices' => $devices]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'mac_address' => ['required', 'regex:/^[A-F0-9]{12}$/'],
            'pin'           => 'required|string|size:6',
            'name'          => 'required|string|max:100',
            'share_emails'  => 'nullable|array',
            'share_emails.*'=> 'nullable|email',
        ]);

        $device = Device::where('mac_address', $request->mac_address)->first();

        if (!$device || !$device->is_active) {
            return back()->withErrors(['mac_address' => 'Equipamento não encontrado ou inativo.'])->withInput();
        }

        if ($device->pin !== $request->pin) {
            return back()->withErrors(['pin' => 'PIN de segurança inválido.'])->withInput();
        }

        if ($device->users()->wherePivot('role', 'owner')->exists()) {
            return back()->withErrors(['mac_address' => 'Este equipamento já possui um dono vinculado.'])->withInput();
        }

        DB::transaction(function () use ($device, $request) {
            auth()->user()->devices()->syncWithoutDetaching([
                $device->id => ['role' => 'owner']
            ]);
            $device->update(['name' => $request->name]);
            $this->processInvites($device, $request);
        });

        return back();
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name'          => 'required|string|max:100',
            'pin'           => 'nullable|string|size:6',
            'share_emails'  => 'nullable|array',
            'share_emails.*'=> 'nullable|email',
        ]);

        $device = auth()->user()->devices()->wherePivot('role', 'owner')->findOrFail($id);

        DB::transaction(function () use ($device, $request) {
            $data = ['name' => $request->name];
            if ($request->filled('pin')) {
                $data['pin'] = $request->pin;
            }
            $device->update($data);

            // [CORREÇÃO]: Lógica de sincronização inteligente de viewers
            $newEmails = array_unique(array_filter($request->input('share_emails', [])));
            
            // Remove apenas os viewers e convites que NÃO estão na nova lista enviada
            $device->users()
                ->wherePivot('role', 'viewer')
                ->whereNotIn('email', $newEmails)
                ->detach();

            $device->invites()
                ->whereNotIn('email', $newEmails)
                ->delete();

            // Reprocessa os convites (o syncWithoutDetaching e updateOrCreate cuidarão de não duplicar)
            $this->processInvites($device, $request);
        });

        return back()->with('success', 'Dispositivo atualizado com sucesso.');
    }

    public function destroy($id)
    {
        $user = auth()->user();
        $device = $user->devices()->findOrFail($id);
        
        if ($device->pivot->role === 'owner') {
            $device->users()->detach();
            $device->invites()->delete();
        } else {
            $user->devices()->detach($id);
        }
        return back();
    }

    private function processInvites($device, $request)
    {
        $emails = array_unique(array_filter($request->input('share_emails', [])));
        $owner = auth()->user();

        foreach ($emails as $email) {
            if ($email === $owner->email) continue;
            $userExists = User::where('email', $email)->first();

            if ($userExists) {
                $userExists->devices()->syncWithoutDetaching([$device->id => ['role' => 'viewer']]);
            } else {
                DeviceInvite::updateOrCreate(
                    ['device_id' => $device->id, 'email' => $email],
                    ['invited_by' => $owner->id, 'accepted_at' => null]
                );
                Notification::route('mail', $email)->notify(new DeviceInviteNotification($device, $owner));
            }
        }
    }

public function dashboard(Request $request, $id)
    {
        $device = $this->findDevice($id);
        $tz = config('app.timezone');

        $endDate = $request->input('end_date')
            ? Carbon::createFromFormat('Y-m-d', $request->input('end_date'), $tz)->endOfDay()
            : now($tz)->endOfDay();

        $startDate = $request->input('start_date')
            ? Carbon::createFromFormat('Y-m-d', $request->input('start_date'), $tz)->startOfDay()
            : $endDate->copy()->subDay()->startOfHour();

        $dados = DadoAgregado::where('device_id', $id)
            ->whereBetween('periodo_inicio', [$startDate, $endDate])
            ->orderBy('periodo_inicio', 'asc')
            ->get();

        $statsTargets = [
            'tensao_l1_n_media' => ['label' => 'Tensão L1-N', 'unit' => 'V'],
            'tensao_l2_n_media' => ['label' => 'Tensão L2-N', 'unit' => 'V'],
            'tensao_l3_n_media' => ['label' => 'Tensão L3-N', 'unit' => 'V'],
            'tensao_l1_l2_media' => ['label' => 'Tensão L1-L2', 'unit' => 'V'],
            'tensao_l2_l3_media' => ['label' => 'Tensão L2-L3', 'unit' => 'V'],
            'tensao_l3_l1_media' => ['label' => 'Tensão L3-L1', 'unit' => 'V'],
            'corrente_l1_media' => ['label' => 'Corrente L1', 'unit' => 'A'],
            'corrente_l2_media' => ['label' => 'Corrente L2', 'unit' => 'A'],
            'corrente_l3_media' => ['label' => 'Corrente L3', 'unit' => 'A'],
            'corrente_neutro_media' => ['label' => 'Corrente Neutro', 'unit' => 'A'],
            'potencia_ativa_total_media' => ['label' => 'Potência Ativa', 'unit' => 'kW'],
            'potencia_reativa_total_media' => ['label' => 'Potência Reativa', 'unit' => 'kVAr'],
            'potencia_aparente_total_media' => ['label' => 'Potência Aparente', 'unit' => 'kVA'],
            'fator_potencia_total_media' => ['label' => 'Fator de Potência', 'unit' => 'cos φ'],
            'frequencia_media' => ['label' => 'Frequência', 'unit' => 'Hz'],
        ];

        $summaryCards = collect($statsTargets)->map(function ($meta, $column) use ($dados) {
                    $values = $dados->pluck($column)->filter(fn($v) => !is_null($v))->map(fn($v) => (float)$v);
                    $totalReg = (int)$dados->sum('registros_contagem');
                    
                    // FIX 2: Corrigir cálculo de média
                    // Usar simples média dos valores horárias, não ponderada
                    // (ponderação só funciona com valores instantâneos, não com médias)
                    $avg = $values->count() > 0 ? $values->average() : null;

                    $minVal = $values->min();
                    $maxVal = $values->max();

                    // Usando first com callback para garantir comparação não-estrita de tipos (String vs Float)
                    $minRecord = !is_null($minVal) ? $dados->first(fn($r) => (float)$r->{$column} == $minVal) : null;
                    $maxRecord = !is_null($maxVal) ? $dados->first(fn($r) => (float)$r->{$column} == $maxVal) : null;

                    return [
                        'key' => $column, 'label' => $meta['label'], 'unit' => $meta['unit'],
                        'min' => $minVal, 'avg' => $avg, 'max' => $maxVal,
                        'min_at' => $minRecord?->periodo_inicio?->toIso8601String(),
                        'max_at' => $maxRecord?->periodo_inicio?->toIso8601String(),
                    ];
                })->values();

        $energyTargets = [
            'energia_ativa_importada_ultima' => ['label' => 'Energia Ativa Importada', 'unit' => 'kWh', 'cons' => 'energia_ativa_importada_consumo'],
            'energia_ativa_exportada_ultima' => ['label' => 'Energia Ativa Exportada', 'unit' => 'kWh', 'cons' => 'energia_ativa_exportada_consumo'],
            'energia_reativa_importada_ultima' => ['label' => 'Energia Reativa Importada', 'unit' => 'kVArh', 'cons' => 'energia_reativa_importada_consumo'],
            'energia_reativa_exportada_ultima' => ['label' => 'Energia Reativa Exportada', 'unit' => 'kVArh', 'cons' => 'energia_reativa_exportada_consumo'],
        ];

        $energyCards = collect($energyTargets)->map(function ($meta, $column) use ($dados) {
            return [
                'key' => $column, 'label' => $meta['label'], 'unit' => $meta['unit'],
                'total' => $dados->last() ? (float)$dados->last()->{$column} : null,
                'consumo' => (float)$dados->sum($meta['cons']),
            ];
        })->values();

        return Inertia::render('dashboard', [
            'device' => $device,
            'filters' => [
                'start_date' => $startDate->toDateString(),
                'end_date' => $endDate->toDateString(),
                'view' => $request->input('view', 'tensoes_fase'),
            ],
            'chartData' => $dados->map(fn($d) => [
                'timestamp' => $d->periodo_inicio->copy()->timezone($tz)->format('d/m/Y H:i'),
                'periodo_inicio' => $d->periodo_inicio->toIso8601String(),
                'updated_at' => $d->updated_at ? Carbon::parse($d->updated_at)->timezone($tz)->toIso8601String() : null,
                'tensao_l1_n' => (float)$d->tensao_l1_n_media,
                'tensao_l2_n' => (float)$d->tensao_l2_n_media,
                'tensao_l3_n' => (float)$d->tensao_l3_n_media,
                'tensao_l1_l2' => (float)$d->tensao_l1_l2_media,
                'tensao_l2_l3' => (float)$d->tensao_l2_l3_media,
                'tensao_l3_l1' => (float)$d->tensao_l3_l1_media,
                'corrente_l1' => (float)$d->corrente_l1_media,
                'corrente_l2' => (float)$d->corrente_l2_media,
                'corrente_l3' => (float)$d->corrente_l3_media,
                'corrente_neutro' => (float)$d->corrente_neutro_media,
                'potencia_ativa' => (float)$d->potencia_ativa_total_media,
                'potencia_reativa' => (float)$d->potencia_reativa_total_media,
                'potencia_aparente' => (float)$d->potencia_aparente_total_media,
                'fator_potencia' => (float)$d->fator_potencia_total_media,
                'frequencia' => (float)$d->frequencia_media,
                'consumo_energia_ativa_importada' => (float)$d->energia_ativa_importada_consumo,
                'consumo_energia_ativa_exportada' => (float)$d->energia_ativa_exportada_consumo,
                'consumo_energia_reativa_importada' => (float)$d->energia_reativa_importada_consumo,
                'consumo_energia_reativa_exportada' => (float)$d->energia_reativa_exportada_consumo,
                'energia_ativa_importada_ultima' => (float)$d->energia_ativa_importada_ultima,
                'energia_ativa_exportada_ultima' => (float)$d->energia_ativa_exportada_ultima,
                'energia_reativa_importada_ultima' => (float)$d->energia_reativa_importada_ultima,
                'energia_reativa_exportada_ultima' => (float)$d->energia_reativa_exportada_ultima,
            ]),
            'summaryCards' => $summaryCards,
            'energyCards' => $energyCards,
        ]);
    }

    public function refreshDashboardData(Request $request, $id)
    {
        $this->findDevice($id);
        $start = $request->input('start_date');
        $end = $request->input('end_date');

        Cache::put(AggregateDashboardData::statusKey((int) $id), [
            'state' => 'queued', 'device_id' => (int) $id, 'queued_at' => now()->toISOString(),
        ], now()->addMinutes(10));

        AggregateDashboardData::dispatch((int) $id, (string) $start, (string) $end, 'hora');

        // [CORREÇÃO]: Usar back() para manter o contexto do Inertia sem trocar URL
        return back()->with('success', 'Atualização solicitada com sucesso.');
    }

    public function refreshDashboardStatus($id)
    {
        $this->findDevice($id);
        return response()->json(Cache::get(AggregateDashboardData::statusKey((int) $id), ['state' => 'idle']));
    }

    public function exportDashboardData(Request $request, $id): StreamedResponse
    {
        $device = $this->findDevice($id);
        $tz = config('app.timezone');
        $endDate = $request->filled('end_date') ? Carbon::parse($request->input('end_date'), $tz)->endOfDay() : now($tz)->endOfDay();
        $startDate = $request->filled('start_date') ? Carbon::parse($request->input('start_date'), $tz)->startOfHour() : $endDate->copy()->subDay();

        $dados = DadoAgregado::where('device_id', $id)->whereBetween('periodo_inicio', [$startDate, $endDate])->orderBy('periodo_inicio')->get();

        return response()->streamDownload(function () use ($dados, $device) {
            $handle = fopen('php://output', 'w');
            fwrite($handle, "\xEF\xBB\xBF");
            
            $cols = ['Início', 'Fim', 'V L1-N', 'V L2-N', 'V L3-N', 'V L1-L2', 'V L2-L3', 'V L3-L1', 'A L1', 'A L2', 'A L3', 'A Neutro', 'kW Total', 'kvar Total', 'kVA Total', 'FP', 'Hz', 'kWh Imp'];
            if ($device->is_generate) $cols[] = 'kWh Exp';
            $cols[] = 'kvarh Imp';
            if ($device->is_generate) $cols[] = 'kvarh Exp';
            $cols[] = 'Registros';

            fputcsv($handle, $cols, ';');

            foreach ($dados as $d) {
                $row = [
                    $d->periodo_inicio->format('d/m/Y H:i:s'), $d->periodo_fim?->format('d/m/Y H:i:s'),
                    $d->tensao_l1_n_media, $d->tensao_l2_n_media, $d->tensao_l3_n_media,
                    $d->tensao_l1_l2_media, $d->tensao_l2_l3_media, $d->tensao_l3_l1_media,
                    $d->corrente_l1_media, $d->corrente_l2_media, $d->corrente_l3_media, $d->corrente_neutro_media,
                    $d->potencia_ativa_total_media, $d->potencia_reativa_total_media, $d->potencia_aparente_total_media,
                    $d->fator_potencia_total_media, $d->frequencia_media, $d->energia_ativa_importada_ultima
                ];
                if ($device->is_generate) $row[] = $d->energia_ativa_exportada_ultima;
                $row[] = $d->energia_reativa_importada_ultima;
                if ($device->is_generate) $row[] = $d->energia_reativa_exportada_ultima;
                $row[] = $d->registros_contagem;

                fputcsv($handle, array_map(fn($v) => is_numeric($v) ? number_format($v, 2, ',', '') : $v, $row), ';');
            }
            fclose($handle);
        }, "Relatorio_{$id}.csv");
    }
}