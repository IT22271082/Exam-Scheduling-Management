<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ResourceAllocationController; // Add this line

Route::post('/login', [AuthController::class, 'login']);

// Add resource allocation routes
Route::apiResource('resource-allocations', ResourceAllocationController::class);

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});