<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\User;

class AdminController extends Controller
{
    public function __construct(){
        $this->middleware('auth');
    }

    public function is_Admin($admin){
        return $admin->role == 'admin';
    }

    public function show(){
        if($this->is_Admin(Auth::user())){
            $normal = User::where('role','normal')->get();
            return response()->json(['users'=>$normal],200);
        }
    }

    public function create(Request $request){
        if($this->is_Admin(Auth::user())){
            $this->validate($request, [
                'email' => 'required|email|unique:users',
                'password' => ['required','min:6','regex:/[a-z]/','regex:/[A-Z]/','regex:/[0-9]/'],
                // 'password_confirm' => 'required|same:password'
            ]);
            $user = new User;
            $user->email = $request->get('email');
            $password = $request->get('password');
            $user->password = app('hash')->make($password);
            $user->verificationCode = sha1(time());
            $user->createdBy = Auth::user()->email;
            $user->save();

            // $code = "whvbj ckejbw";
            //send mail after signup
            // Mail::to($user->email)->send(new verifyEmail($code));
            return response()->json(['user' => $user, 'createdBy' => Auth::user()->email], 201);

        } else response()->json(['message'=>'Unauthorized. Not an admin'],402);
    }

    public function destroy($userId){
        $deleteUser = User::findorFail($userId);
        if($deleteUser->role == 'admin') return response()->json(['message'=>'Admin cant be deleted'],402);
        if($this->is_Admin(Auth::user())){
            $deleteUser->delete();
            return response()->json(['message'=>'Deleted User','Deleted by'=>Auth::user()->email],200);
        } else {
            return response()->json(['message'=>'Unauthorized. Not an admin'],402);
        }
    }
}
