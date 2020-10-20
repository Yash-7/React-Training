<?php

namespace App\Jobs;

use App\Jobs\Job;
use Illuminate\Support\Facades\Mail;
use App\Mail\verifyEmail;
use App\Mail\forgotPassword;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
// use Illuminate\Contracts\Bus\SelfHandling;
use Illuminate\Contracts\Queue\ShouldQueue;

class RegisterMails extends Job implements ShouldQueue
{
    use SerializesModels;

    protected $email,$token;

    /**
     * Create a new job instance.
     *
     * @param  User  $user
     * @return void
     */
    public function __construct($email,$token)
    {
        $this->email = $email;
        $this->token=$token;
    }

    /**
     * Execute the job.
     *
     * @param  Mailer  $mailer
     * @return void
     */
    public function handle()
    {
        Mail::to($this->email)->send(new verifyEmail($this->token));
    }
}