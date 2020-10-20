<?php

namespace App\Listeners;

use App\Events\NotificationEvent;
use Pusher;

class NotificationListener
{
    /**
     * Create the event listener.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }

    /**
     * Handle the event.
     *
     * @param  NotificationEvent  $event
     * @return void
     */
    public function handle(NotificationEvent $event)
    {
        $options = array(
            'cluster' => 'ap2',
            'useTLS' => true
        );
        $pusher = new Pusher\Pusher(
            '53ec7dc21ce2dd50eedf',
            '8f05caf15e73f0e9a783',
            '1088648',
            $options
        );
        $pusher->trigger($event->data->channel, $event->data->event, $event->data);
    }
}
