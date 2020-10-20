<?php

namespace App\Events;

use App\NotificationData;

class NotificationEvent extends Event
{
    /**
     * Create a new event instance.
     *
     * @return void
     */
    public $data; 
    public function __construct(NotificationData $data)
    {
        $this->data=$data;
    }
}
