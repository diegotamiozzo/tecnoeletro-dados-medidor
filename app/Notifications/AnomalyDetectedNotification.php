<?php

namespace App\Notifications;

use App\Models\Device;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Notification;
use Illuminate\Notifications\Messages\MailMessage;

class AnomalyDetectedNotification extends Notification implements ShouldQueue
{
    use Queueable;

    private Device $device;
    private array $anomalies;
    private array $metrics;

    public function __construct(Device $device, array $anomalies, array $metrics)
    {
        $this->device = $device;
        $this->anomalies = $anomalies;
        $this->metrics = $metrics;
    }

    public function via($notifiable)
    {
        return ['mail', 'database'];
    }

    public function toMail($notifiable)
    {
        $subject = "Anomalia detectada no dispositivo: {$this->device->name}";
        $msg = (new MailMessage)
            ->subject($subject)
            ->greeting('Olá')
            ->line("Foram detectadas " . count($this->anomalies) . " anomalias no dispositivo \"{$this->device->name}\".")
            ->action('Ver painel', url("/devices/{$this->device->id}/dashboard"));

        foreach ($this->anomalies as $a) {
            if ($a['type'] === 'voltage') {
                $msg->line("Tensão ({$a['phase']}) = {$a['measured']}V (desvio: " . number_format($a['deviation_pct'], 2) . "% do nominal {$a['nominal']}V)");
            } elseif ($a['type'] === 'power_factor') {
                $msg->line("Fator de potência baixo = {$a['measured']}");
            } elseif ($a['type'] === 'frequency') {
                $msg->line("Frequência fora do intervalo = {$a['measured']} Hz");
            }
        }

        return $msg;
    }

    public function toArray($notifiable)
    {
        return [
            'device_id' => $this->device->id,
            'device_name' => $this->device->name,
            'anomalies' => $this->anomalies,
            'metrics' => $this->metrics,
        ];
    }
}
