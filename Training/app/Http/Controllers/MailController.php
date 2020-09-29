<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder;

use App\User;

class MailController extends Controller
{
    public function verify($token){
        $user = User::whereHas('etoken',function(Builder $query) use ($token){
            $query->where('verificationCode','=',$token);
        })->first();
        
        if ($user != null){
            if($user->isVerified==1){
                return response()->json(['message'=>'Email already verified'],200);
            }
            $user->isVerified = 1;
            $user->save();

            return response()->json(['message'=>"Email verified"],200);
        } else {
            return response()->json(['message'=>"Token is tampered"],401);
        }
    
        
    }
}
