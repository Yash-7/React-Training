<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;

use App\User;
use App\Etoken;
use App\Ftoken;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        //
    }
    public function register(Request $request){
        $this->validate($request, [
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => ['required','min:6','regex:/[a-z]/','regex:/[A-Z]/','regex:/[0-9]/'],
            // 'password_confirm' => 'required|same:password'
        ]);
        try{
            $user = new User;
            $user->name = $request->get('name');
            $user->email = $request->get('email');
            $password = $request->get('password');
            $user->password = app('hash')->make($password);
            $user->save();
            $etoken = new Etoken;
            $etoken->verificationCode = str_random(32);
            $user->etoken()->save($etoken);
            $ftoken = new Ftoken;
            $ftoken->verificationCode = str_random(32);
            $user->ftoken()->save($ftoken);
            

            // $code = "whvbj ckejbw";
            //send mail after signup
            // Mail::to($user->email)->send(new verifyEmail($code));


            return response()->json(['user' => $user, 'message' => 'CREATED'], 201);
        } catch(Exception $e){
            throw $e;
        }
    }  
    public function login(Request $request) {
        //validation 
        $this->validate($request, [
            'email' => 'required|string',
            'password' => 'required|string',
        ]);

        $credentials = $request->only(['email', 'password']);
        
        if (! $token =Auth::attempt($credentials)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $user = User::where(['email'=>$request->email])->first();
        if($user->isVerified == 0) {
            return response()->json(['message'=>"email not verified"],401);
        }
        return $this->respondWithToken($token);
    }


    public function reset(Request $request){
        $this->validate($request, [
            'email'=>'required',
            'Old_Password' => 'required',
            'New_Password' => ['required','min:6','regex:/[a-z]/','regex:/[A-Z]/','regex:/[0-9]/']
            // 'password_confirm' => 'required|same:password'
        ]);
        $user = User::where(['email'=>$request->get('email')])->first();
        if($user == null) return "Email incorrect.";
        $oldPwd = $request->get('Old_Password');
        $newPwd = $request->get('New_Password');
        if($oldPwd === $newPwd) {
            return response()->json(['message'=>"New Password can't be same as the old password."],403);
        }
        
        if(!Hash::check($oldPwd, $user->password)){
            return response()->json(['message'=>"Old Password entered is incorrect."],401);
        }
        $user->password = Hash::make($newPwd);
        $user->save();
        return response()->json(['message'=>"New Password updated."],200);
    }
}
