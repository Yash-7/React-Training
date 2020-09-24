<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\User;

class MailController extends Controller
{
    public function verify(Request $request,$token){
        $user = User::where(['verificationCode'=>$token])->first();
        if ($user != null){
            if($user->isVerified==1){
                return response()->json(['message'=>'Email already verified'],402);
            }
             $user->isVerified = 1;
             $user->emailVerified_at = date('Y-m-d H:i:s');
             $user->save();

             return "Email verified";
        } else {
            return "Token is tampered.";
        }
    }
}
