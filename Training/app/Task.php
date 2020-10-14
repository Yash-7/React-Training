<?php

namespace App;

use App\User;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Task extends Model
{
    use SoftDeletes;
    
    public function user() {
        return $this->belongsTo(User::class);
    }
    protected $fillable = ['title','description','assignee','dueDate','status','user_id'];

    protected $hidden = [];
}
