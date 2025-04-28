<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ExamScheduleController;
use App\Http\Controllers\AuthController;

// Exam Schedule Routes
Route::get('/exam-schedules', [ExamScheduleController::class, 'index']); // Get all schedules
Route::post('/exam-schedules', [ExamScheduleController::class, 'store']); // Add schedule
Route::get('/exam-schedules/{id}', [ExamScheduleController::class, 'show']); // Fetch single schedule for editing
Route::put('/exam-schedules/{id}', [ExamScheduleController::class, 'update']); // Update schedule
Route::delete('/exam-schedules/{id}', [ExamScheduleController::class, 'destroy']); // Delete schedule

// Authentication Routes
Route::post('/login', [AuthController::class, 'login']);

// Get authenticated user details
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
