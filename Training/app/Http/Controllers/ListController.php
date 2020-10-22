<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\User;

class ListController extends Controller
{
    public function showAdmin()
    {
        $admins = User::where('role', 'admin')->get();
        return response()->json(['admins' => $admins], 200);
    }
    public function showNormal()
    {
        $normal = User::where('role', 'normal')->get();
        return response()->json(['users' => $normal], 200);
    }
}
