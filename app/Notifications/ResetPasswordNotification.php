<?php

namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ResetPasswordNotification extends Notification
{
    use Queueable;

    public $token;

    /**
     * Create a new notification instance.
     */
    public function __construct($token)
    {
        $this->token = $token;
    }

    /**
     * Get the notification's delivery channels.
     */
    public function via(object $notifiable): array
    {
        return ['mail'];
    }

    /**
     * Get the mail representation of the notification.
     */
    public function toMail(object $notifiable): MailMessage
    {
        $url = url(route('password.reset', [
            'token' => $this->token,
            'email' => $notifiable->getEmailForPasswordReset(),
        ], false));

        return (new MailMessage)
            ->subject('Tecnoeletro - Recuperação de Senha')
            ->greeting('Olá, ' . $notifiable->name . '!')
            
            ->line('Você solicitou a redefinição de senha para sua conta **Tecnoeletro**.')
            ->line('Clique no botão abaixo para criar uma nova senha:')
            
            ->action('Redefinir senha', $url)
            
            ->line('Este link é válido por **60 minutos**.')
            ->line('Se você não fez essa solicitação, pode ignorar este e-mail com segurança.')
            
            ->salutation('Tecnoeletro');
    }

    /**
     * Get the array representation of the notification.
     */
    public function toArray(object $notifiable): array
    {
        return [];
    }
}