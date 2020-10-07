<?php
namespace App\Mail;
 
use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;
use Illuminate\Contracts\Queue\ShouldQueue;
 
class MyEmail extends Mailable {
 
    use Queueable,
        SerializesModels;

    public function __construct($code)
    {
        $this->code = $code;
    }
 
    //build the message.
    public function build() {
        return $this->view('my-email')
        ->with([
            'code' => $this->code,
        ]);;
    }
}