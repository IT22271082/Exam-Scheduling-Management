<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LecturerController;
use App\Http\Controllers\AuthController;

// Login Route
Route::post('/login', [AuthController::class, 'login']);

// Authenticated User Route
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// API Routes Group
Route::middleware('api')->group(function () {
    Route::resource('lecturers', LecturerController::class);
});

