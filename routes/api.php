<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\StudentController;

// API routes for student CRUD operations
Route::post('/student', [StudentController::class, 'store']);        // Create student
Route::get('/students', [StudentController::class, 'index']);        // Get all students
Route::get('/students/{id}', [StudentController::class, 'show']);    // Get one student
Route::put('/students/{id}', [StudentController::class, 'update']);  // Update student
Route::delete('/students/{id}', [StudentController::class, 'destroy']); // Delete student

// Auth routes
Route::post('/login', [AuthController::class, 'login']);  // Login route (if you're implementing authentication)

// Example of a route that returns the authenticated user (if you're using Sanctum or Passport for API auth)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
