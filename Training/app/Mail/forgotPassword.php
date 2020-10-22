<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class forgotPassword extends Mailable
{
    use Queueable, SerializesModels;

    public function __construct($token)
    {
        $this->token = $token;
    }

    public function build()
    {
        return $this->view('forgotPassword')
            ->with([
                "token" => $this->token
            ]);
    }
}
