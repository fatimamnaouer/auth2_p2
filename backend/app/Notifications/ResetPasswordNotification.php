<?php
namespace App\Notifications;

use Illuminate\Bus\Queueable;
use Illuminate\Notifications\Notification;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;

class ResetPasswordNotification extends Notification
{
    use Queueable;

    public $token; // Déclaration de la propriété

    /**
     * Crée une nouvelle instance de notification.
     *
     * @param  string  $token
     * @return void
     */
    public function __construct($token)
    {
        $this->token = $token; // Initialisation de la propriété
    }

    /**
     * Obtient les canaux de notification.
     *
     * @param  mixed  $notifiable
     * @return array|string
     */
    public function via($notifiable)
    {
        return ['mail'];
    }

    /**
     * Obtient la représentation de la notification par mail.
     *
     * @param  mixed  $notifiable
     * @return \Illuminate\Notifications\Messages\MailMessage
     */
    public function toMail($notifiable)
    {
        $url = url('/api/password/reset/' . $this->token); // Utilisation de la propriété $token

        return (new MailMessage)
                    ->line('Vous recevez cet e-mail parce que nous avons reçu une demande de réinitialisation du mot de passe pour votre compte.')
                    ->action('Réinitialiser le mot de passe', $url)
                    ->line('Si vous n\'avez pas demandé de réinitialisation de mot de passe, aucune action supplémentaire n\'est requise.');
    }
}
