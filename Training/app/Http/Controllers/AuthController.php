<?php

namespace App\Http\Controllers;
use Illuminate\Http\Request;

use App\User;
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
        // Validation
        
        try{
            $this->validate($request, [
                'email' => 'required|email|unique:users',
                'password' => ['required','min:6','regex:/[a-z]/','regex:/[A-Z]/','regex:/[0-9]/'],
                // 'password_confirm' => 'required|same:password'
            ]);
        } catch(Exception $e){
            return response()->json(['details' => $e>errors(),], 422);
        }

        try{
            $user = new User;
            $user->email = $request->get('email');
            $password = $request->get('password');
            $user->password = app('hash')->make($password);
            $user->verificationCode = sha1(time());
            $user->save();

            // $code = "whvbj ckejbw";
            //send mail after signup
            // Mail::to($user->email)->send(new verifyEmail($code));


            return response()->json(['user' => $user, 'message' => 'CREATED'], 201);
        } catch(Exception $e){
            return $e;
        }
    }  
    public function login(Request $request) {
        //validation 
        $this->validate($request, [
            'email' => 'required|string',
            'password' => 'required|string',
        ]);

        $credentials = $request->only(['email', 'password']);
        
        if (! $token = Auth::attempt($credentials)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $user = User::where(['email'=>$request->email])->first();
        if($user->isVerified == 0) {
            return "email not verified";
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
            return "New Password can't be same as the old password.";
        }
        
        if(!Hash::check($oldPwd, $user->password)){
            return "Old password entered is incorrect.";
        }
        $user->password = Hash::make($newPwd);
        $user->save();
        return "new Password updated";
    }
}
