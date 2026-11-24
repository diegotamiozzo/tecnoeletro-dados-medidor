<?php

namespace App\Notifications;

use App\Models\Device;
use App\Models\User;
use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class DeviceInviteNotification extends Notification
{
    use Queueable;

    /**
     * Cria uma nova instância da notificação.
     * * @param Device $device O dispositivo ao qual o usuário está sendo convidado.
     * @param User $owner O proprietário que realizou o convite.
     */
    public function __construct(
        protected Device $device,
        protected User $owner
    ) {}

    /**
     * Define os canais de entrega da notificação.
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Constrói a mensagem de e-mail.
     */
    public function toMail(object $notifiable): MailMessage
    {
        // Captura o e-mail de forma segura para usuários reais ou rotas anônimas
        $email = $notifiable instanceof \App\Models\User 
            ? $notifiable->email 
            : $notifiable->routeNotificationFor('mail');

        // Monta a URL de registro com o parâmetro de e-mail
        $registrationUrl = url('/register') . '?email=' . urlencode($email);

        return (new MailMessage)
            ->subject('Convite de Acesso: ' . $this->device->name)
            ->greeting('Olá!')
            ->line("O usuário **{$this->owner->name}** convidou você para monitorar o dispositivo **{$this->device->name}** na plataforma Tecnoeletro.")
            ->line('Como você ainda não possui uma conta em nosso sistema, clique no botão abaixo para realizar o seu cadastro.')
            ->action('Criar Minha Conta', $registrationUrl)
            ->line('Importante: Será utilizado o mesmo e-mail deste convite para garantir que o dispositivo seja vinculado automaticamente ao seu perfil.')
            ->line('Se você não esperava este convite, pode ignorar este e-mail com segurança.')
            ->salutation('Atenciosamente, Tecnoeletro');
    }

    /**
     * Define a representação em array da notificação (opcional).
     */
    public function toArray(object $notifiable): array
    {
        return [
            'device_id' => $this->device->id,
            'owner_id' => $this->owner->id,
        ];
    }
}