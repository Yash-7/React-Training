<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Support\Facades\Hash;

use App\User;

class UserController extends Controller
{
    public function __construct(){
        $this->middleware('auth');
    }
    public function show($id){
        if($id == Auth::id()){
            $user = User::findorFail($id);
            return response()->json(['user'=>$user],200);
        }
        else {
            return response()->json(['message'=>'Token invalid'],401);
        }
    }
    public function createPassword(Request $request, $token) {
        $user = User::whereHas('ftoken',function(Builder $query) use ($token){
            $query->where('verificationCode','=',$token);
        })->first();
        if($user!=null){
            $this->validate($request,[
                'password'=>['required','min:6','regex:/[a-z]/','regex:/[A-Z]/','regex:/[0-9]/'] 
            ]);
            $user->password = app('hash')->make($request->get('password'));
            $user->save();
            return response()->json(['user'=>$user],201);
        } else {
            return response()->json(['message'=>'Token is tampered'],401);
        }
    }

    public function forgot(Request $request, $token){
        $user = User::whereHas('ftoken',function(Builder $query) use ($token){
            $query->where('verificationCode','=',$token);
        })->first();
        if($user!=null){
            $this->validate($request,[
                'New_Password'=>['required','min:6','regex:/[a-z]/','regex:/[A-Z]/','regex:/[0-9]/'] 
            ]);

            if(Hash::check($request->get('New_Password'), $user->password)){
                return response()->json(['message'=>"New Password cannot be same as the old password."],401);
            }
            $user->password = app('hash')->make($request->get('New_Password'));
            $user->save();
            return response()->json(['user'=>$user],201);
        } else {
            return response()->json(['message'=>'Token is tampered'],401);
        }
    }
}
