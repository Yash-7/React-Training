<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\User;
use App\Etoken;
use App\Ftoken;
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
                'name' =>'required',
                'email' => 'required|email|unique:users'
                // 'password_confirm' => 'required|same:password'
            ]);
            $user = new User;
            $user->name = $request->get('name');
            $user->email = $request->get('email');
            $user->createdBy = Auth::user()->id;
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
            return response()->json(['user' => $user, 'createdBy' => Auth::user()->email], 201);

        } else return response()->json(['message'=>'Unauthorized. Not an admin'],402);
    }

    public function destroy($userId){
        $deleteUser = User::find($userId);
        if($deleteUser==null) return response()->json(['Error'=>'User unavailable'],401);
        if($deleteUser->role == 'admin') return response()->json(['message'=>'Admin cant be deleted'],402);
        if($this->is_Admin(Auth::user())){
            $deleteUser->deletedBy=Auth::user()->id;
            $deleteUser->save();
            $deleteUser->delete();
            return response()->json(['message'=>'Deleted User','user'=>$deleteUser],200);
        } else {
            return response()->json(['message'=>'Unauthorized. Not an admin'],402);
        }
    }
}
