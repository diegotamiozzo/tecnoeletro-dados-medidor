<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Device;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DeviceController extends Controller
{
    public function index()
    {
        $devices = Device::with(['users' => function ($query) {
            $query->wherePivot('role', 'owner')->select('users.id', 'users.name', 'users.email');
        }])
        ->orderBy('created_at', 'desc')
        ->get()
        ->map(function ($device) {
            return [
                'id'          => $device->id,
                'mac_address' => $device->mac_address,
                'pin'         => $device->pin,
                'name'        => $device->name,
                'is_active'   => (bool) $device->is_active,
                'is_generate' => (bool) $device->is_generate, // Adicionado aqui para o React receber
                'created_at'  => $device->created_at->format('d/m/Y H:i'),
                'owner'       => $device->users->first() 
                    ? ['name' => $device->users->first()->name, 'email' => $device->users->first()->email]
                    : null,
            ];
        });

        return Inertia::render('admin/devices', [
            'devices' => $devices,
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'mac_address' => ['required', 'regex:/^[A-F0-9]{12}$/', 'unique:devices,mac_address'],
            'pin'         => ['required', 'digits:6'],
            'name'        => ['required', 'string', 'max:100'],
            'is_generate' => ['required', 'boolean'], // Validação adicionada
        ], [
            'mac_address.unique' => 'Este MAC Address já está cadastrado.',
            'mac_address.regex'  => 'MAC Address inválido. Use 12 caracteres hexadecimais (ex: D4AD20BD9C0F).',
            'pin.digits'         => 'O PIN deve ter exatamente 6 dígitos numéricos.',
        ]);

        Device::create([
            'mac_address' => strtoupper(preg_replace('/[^a-zA-Z0-9]/', '', $request->mac_address)),
            'pin'         => $request->pin,
            'name'        => $request->name,
            'is_active'   => true,
            'is_generate' => $request->is_generate, // Salvando no banco
        ]);

        return back()->with('success', 'Equipamento cadastrado com sucesso.');
    }

    public function update(Request $request, Device $device)
    {
        $request->validate([
            'name'        => ['required', 'string', 'max:100'],
            'pin'         => ['required', 'digits:6'],
            'is_active'   => ['required', 'boolean'],
            'is_generate' => ['required', 'boolean'], // Validação adicionada
        ]);

        $device->update([
            'name'        => $request->name,
            'pin'         => $request->pin,
            'is_active'   => $request->is_active,
            'is_generate' => $request->is_generate, // Atualizando no banco
        ]);

        return back()->with('success', 'Equipamento atualizado com sucesso.');
    }

    public function destroy(Device $device)
    {
        $device->users()->detach();
        $device->invites()->delete();
        $device->delete();

        return back()->with('success', 'Equipamento removido com sucesso.');
    }
}