<?php

namespace App;

use App\Etoken;
use App\Ftoken;
use App\Task;
use Illuminate\Auth\Authenticatable;
use Laravel\Lumen\Auth\Authorizable;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Contracts\Auth\Authenticatable as AuthenticatableContract;
use Illuminate\Contracts\Auth\Access\Authorizable as AuthorizableContract;
use Illuminate\Database\Eloquent\SoftDeletes;

use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Model implements AuthenticatableContract, AuthorizableContract, JWTSubject
{
    use Authenticatable, Authorizable, SoftDeletes;
    public function etoken()
    {
        return $this->hasOne(Etoken::class);
    }
    public function ftoken()
    {
        return $this->hasOne(Ftoken::class);
    }
    public function tasks()
    {
        return $this->hasMany(Task::class);
    }
    protected $fillable = [
        'email', 'role', 'createdBy'
    ];

    protected $hidden = [
        'password', 'verificationCode'
    ];

    public function getJWTIdentifier()
    {
        return $this->getKey();
    }

    public function getJWTCustomClaims()
    {
        return [];
    }
}
