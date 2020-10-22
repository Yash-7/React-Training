<?php

namespace App\Jobs;

use App\Jobs\Job;
use App\Mail\createPassword;
use Illuminate\Support\Facades\Mail;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class CreatePasswordMail extends Job implements ShouldQueue
{
    use SerializesModels;

    protected $email, $token;

    public function __construct($email, $token)
    {
        $this->email = $email;
        $this->token = $token;
    }
    public function handle()
    {
        Mail::to($this->email)->send(new createPassword($this->token));
    }
}
