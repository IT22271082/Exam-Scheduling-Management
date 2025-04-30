<?php

use Illuminate\Support\Facades\Route;

use App\Http\Controllers\ExamScheduleController;

use App\Http\Controllers\StudentController;

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ResourceAllocationController; // Add this line
use Illuminate\Http\Request;
use App\Http\Controllers\AbsentStudentController;
use App\Http\Controllers\Api\MedicalFormController;

Route::post('/send-absentee-form', function () {
    $students = \App\Models\Student::all();
    $formUrl = 'https://forms.gle/YOUR_FORM_LINK';

// Add resource allocation routes
Route::apiResource('resource-allocations', ResourceAllocationController::class);
    foreach ($students as $student) {
        \Illuminate\Support\Facades\Mail::to($student->email)
            ->send(new \App\Mail\AbsenteeFormMail($formUrl));
    }


// Exam Schedule Routes
Route::get('/exam-schedules', [ExamScheduleController::class, 'index']); // Get all schedules
Route::post('/exam-schedules', [ExamScheduleController::class, 'store']); // Add schedule
Route::get('/exam-schedules/{id}', [ExamScheduleController::class, 'show']); // Fetch single schedule for editing
Route::put('/exam-schedules/{id}', [ExamScheduleController::class, 'update']); // Update schedule
Route::delete('/exam-schedules/{id}', [ExamScheduleController::class, 'destroy']); // Delete schedule

// Authentication Routes
Route::post('/login', [AuthController::class, 'login']);

// Get authenticated user details

    return response()->json(['message' => 'Absentee form sent to all students']);
});
Route::apiResource('absent-students', AbsentStudentController::class);
// API routes for student CRUD operations
Route::post('/student', [StudentController::class, 'store']);        // Create student
Route::get('/students', [StudentController::class, 'index']);        // Get all students
Route::get('/students/{id}', [StudentController::class, 'show']);    // Get one student
Route::put('/students/{id}', [StudentController::class, 'update']);  // Update student
Route::delete('/students/{id}', [StudentController::class, 'destroy']); // Delete student

// Auth routes
Route::post('/login', [AuthController::class, 'login']);  // Login route

// Example of a route that returns the authenticated user

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
});

Route::apiResource('medical-forms', MedicalFormController::class);
Route::get('students/{studentId}/medical-forms', [MedicalFormController::class, 'studentForms']);


