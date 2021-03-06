<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\User;
use App\Etoken;
use App\Ftoken;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Eloquent\Builder;
use App\Jobs\RegisterMails;
use App\Jobs\ForgotPasswordMail;
use Illuminate\Support\Str;

class AuthController extends Controller
{
    public function __construct()
    {
        //
    }
    public function register(Request $request)
    {
        $this->validate($request, [
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => ['required', 'min:6', 'regex:/[a-z]/', 'regex:/[A-Z]/', 'regex:/[0-9]/'],
            // 'password_confirm' => 'required|same:password'
        ]);
        $user = new User;
        $user->name = $request->get('name');
        $user->email = $request->get('email');
        $password = $request->get('password');
        $user->password = app('hash')->make($password);
        $user->save();
        $etoken = new Etoken;
        $etoken->verificationCode = Str::random(32);
        $user->etoken()->save($etoken);
        $ftoken = new Ftoken;
        $ftoken->verificationCode = Str::random(32);
        $user->ftoken()->save($ftoken);

        // Mail::to($user->email)->send(new verifyEmail($etoken->verificationCode));
        $this->dispatch(new RegisterMails($user->email, $etoken->verificationCode));
        return response()->json(['user' => $user, 'message' => 'CREATED'], 201);
    }
    public function login(Request $request)
    {
        //validation 
        $this->validate($request, [
            'email' => 'required|string',
            'password' => 'required|string',
        ]);

        $credentials = $request->only(['email', 'password']);

        if (!$token = Auth::attempt($credentials)) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }
        $user = User::where(['email' => $request->email])->first();
        if ($user->isVerified == 0) {
            return response()->json(['message' => "email not verified"], 403);
        }
        $ftoken = $user->ftoken()->first();
        return $this->respondWithToken($token, $user->only(['id', 'name', 'email', 'role']), $ftoken->verificationCode);
    }


    public function reset(Request $request)
    {
        $this->validate($request, [
            'email' => 'required',
            'Old_Password' => 'required',
            'New_Password' => ['required', 'min:6', 'regex:/[a-z]/', 'regex:/[A-Z]/', 'regex:/[0-9]/']
            // 'password_confirm' => 'required|same:password'
        ]);
        $user = User::where(['email' => $request->get('email')])->first();
        if ($user == null) return response()->json(['message' => 'email incorrect'], 401);
        $oldPwd = $request->get('Old_Password');
        $newPwd = $request->get('New_Password');
        if ($oldPwd === $newPwd) {
            return response()->json(['message' => "New Password can't be same as the old password."], 403);
        }

        if (!Hash::check($oldPwd, $user->password)) {
            return response()->json(['message' => "Old Password entered is incorrect."], 401);
        }
        $user->password = Hash::make($newPwd);
        $user->save();
        return response()->json(['message' => "New Password updated."], 200);
    }

    public function forgot(Request $request, $token)
    {
        $user = User::whereHas('ftoken', function (Builder $query) use ($token) {
            $query->where('verificationCode', '=', $token);
        })->first();
        if ($user != null) {
            $this->validate($request, [
                'New_Password' => ['required', 'min:6', 'regex:/[a-z]/', 'regex:/[A-Z]/', 'regex:/[0-9]/']
            ]);

            if (Hash::check($request->get('New_Password'), $user->password)) {
                return response()->json(['message' => "New Password cannot be same as the old password."], 403);
            }
            $user->password = app('hash')->make($request->get('New_Password'));
            $user->save();
            return response()->json(['user' => $user], 201);
        } else {
            return response()->json(['message' => 'Token is tampered'], 401);
        }
    }

    public function checkEmail(Request $request)
    {
        $this->validate($request, [
            'email' => 'required|email',
        ]);
        $user = User::where(['email' => $request->get('email')])->first();
        if ($user != null) {
            $token = ($user->ftoken()->get())[0]->verificationCode;
            $this->dispatch(new ForgotPasswordMail($request->get('email'), $token));
            return response()->json(['user' => $user], 200);
        } else {
            return response()->json(['message' => 'Email incorrect'], 404);
        }
    }
    public function createPassword(Request $request, $token)
    {
        $user = User::whereHas('ftoken', function (Builder $query) use ($token) {
            $query->where('verificationCode', '=', $token);
        })->first();
        if ($user != null) {
            $this->validate($request, [
                'password' => ['required', 'min:6', 'regex:/[a-z]/', 'regex:/[A-Z]/', 'regex:/[0-9]/']
            ]);
            if ($user->password != null) return response()->json(['message' => 'Password already created'], 400);
            $user->password = app('hash')->make($request->get('password'));
            $user->isVerified = 1;
            $user->save();
            return response()->json(['user' => $user], 201);
        } else {
            return response()->json(['message' => 'Token is tampered'], 401);
        }
    }
}
