<?php

namespace App\Events;

use App\NotificationData;

class NotificationEvent extends Event
{
    public $data;
    public function __construct(NotificationData $data)
    {
        $this->data = $data;
    }
}
