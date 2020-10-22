<?php

namespace App\Jobs;

use App\Jobs\Job;
use Illuminate\Support\Facades\Mail;
use App\Mail\newTask;
use Illuminate\Queue\SerializesModels;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Contracts\Queue\ShouldQueue;

class NewTaskJob extends Job implements ShouldQueue
{
    use SerializesModels;

    protected $email, $task;

    public function __construct($email, $task)
    {
        $this->email = $email;
        $this->task = $task;
    }
    public function handle()
    {
        Mail::to($this->email)->send(new newTask($this->task));
    }
}
