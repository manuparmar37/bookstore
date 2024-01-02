<?php
namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class OrderEmail extends Mailable
{
    use Queueable, SerializesModels;

    public function build()
    {
        return $this->from('manuparmar353@gmail.com', 'BookStore')->view('emails.my-email')
                    ->subject('Subject of the email');
    }
}