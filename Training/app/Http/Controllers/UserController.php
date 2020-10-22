<?php

namespace App\Http\Controllers;

use Illuminate\Support\Facades\Auth;

use App\User;

class UserController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }
    public function show($id)
    {
        if ($id == Auth::id()) {
            $user = User::findorFail($id);
            return response()->json(['user' => $user], 200);
        } else {
            return response()->json(['message' => 'Token invalid'], 401);
        }
    }
}
