<?php

namespace App;

use App\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Etoken extends Model
{
    use SoftDeletes;

    public function user()
    {
        return $this->belongsTo(User::class);
    }
    protected $table = "etoken";

    protected $fillable = ['user_id'];

    protected $hidden = ['verificationCode'];
}
