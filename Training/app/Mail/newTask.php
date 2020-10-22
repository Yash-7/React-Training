<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Mail\Mailable;
use Illuminate\Queue\SerializesModels;

class newTask extends Mailable
{
    use Queueable, SerializesModels;


    public function __construct($task)
    {
        $this->task = $task;
    }


    public function build()
    {
        return $this->view('newTask')
            ->with([
                'title' => $this->task->title,
                'desc' => $this->task->description
            ]);
    }
}
