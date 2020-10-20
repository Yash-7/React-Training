<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\User;
use App\Etoken;
use App\Ftoken;
use Illuminate\Support\Facades\Mail;
use App\Mail\createPassword;
use App\Jobs\CreatePasswordMail;

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
        } else return response()->json(['user'=>Auth::user(),'message'=>'Unauthorized. Not an admin'],401);
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

            $this->dispatch(new CreatePasswordMail($user->email,$ftoken->verificationCode));
            return response()->json(['user' => $user], 201);

        } else return response()->json(['user'=>Auth::user(),'message'=>'Unauthorized. Not an admin'],401);
    }

    public function destroy($userId){
        $deleteUser = User::find($userId);
        if($deleteUser==null) return response()->json(['Error'=>'User unavailable'],400);
        if($deleteUser->role == 'admin') return response()->json(['message'=>'Admin cant be deleted'],401);
        if($this->is_Admin(Auth::user())){
            $deleteUser->deletedBy=Auth::user()->id;
            $deleteUser->save();
            $deleteUser->delete();
            return response()->json(['message'=>'Deleted User','user'=>$deleteUser],200);
        } else {
            return response()->json(['message'=>'Unauthorized. Not an admin'],401);
        }
    }

    public function filter(Request $request){
        if($this->is_Admin(Auth::user())){
            $users = User::where('role','=','normal');
            // return $request->all();
            if($request->has('name')){
                $users->where('name','LIKE','%'.$request->get('name').'%'); 
            }
            if($request->has('email')){
                $users->where('email','LIKE','%'.$request->get('email').'%');
            }
            if($request->has('radio')){
                if($request->get('radio')=="verified"){
                    $users->where('isVerified','=','1');
                }
                if($request->get('radio')=="nonVerified"){
                    $users->where('isVerified','=','0');
                }
            }
            return $users->get();
        }
        else return response()->json(['message'=>"Unauthorised"],401);
    }
}
