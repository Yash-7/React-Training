<?php

namespace App;
use App\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Ftoken extends Model
{
    use SoftDeletes;

    public function user() {
        return $this->belongsTo(User::class);
    }
    protected $table = "ftoken";

    protected $fillable = ['user_id','verificationCode'];

}
