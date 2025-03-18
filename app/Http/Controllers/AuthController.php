<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $credentials = $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        // Use guard('web') to ensure the correct guard is used
        if (!Auth::guard('web')->attempt($credentials)) {
            return response()->json(['error' => 'Unauthorized'], 401);
        }

        // Get authenticated user
        $user = Auth::guard('web')->user();

        // Generate API token (assuming you're using Sanctum or Passport)
        $token = $user->createToken('access-token')->plainTextToken;

        return response()->json(['token' => $token, 'user' => $user]);
    }
}

