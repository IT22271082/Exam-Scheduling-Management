<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\LecturerController;
use App\Http\Controllers\ExamScheduleController;
use App\Http\Controllers\StudentController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ResourceAllocationController;
use Illuminate\Http\Request;
use App\Http\Controllers\AbsentStudentController;
use App\Http\Controllers\Api\MedicalFormController;

// Authentication Routes
Route::post('/login', [AuthController::class, 'login']);
Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');

// Authenticated User Route
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Lecturer Routes
Route::middleware('api')->group(function () {
    Route::resource('lecturers', LecturerController::class);
});

// Resource Allocation Routes
Route::apiResource('resource-allocations', ResourceAllocationController::class);

// Exam Schedule Routes
Route::get('/exam-schedules', [ExamScheduleController::class, 'index']);
Route::post('/exam-schedules', [ExamScheduleController::class, 'store']);
Route::get('/exam-schedules/{id}', [ExamScheduleController::class, 'show']);
Route::put('/exam-schedules/{id}', [ExamScheduleController::class, 'update']);
Route::delete('/exam-schedules/{id}', [ExamScheduleController::class, 'destroy']);

// Student Routes
Route::post('/student', [StudentController::class, 'store']);
Route::get('/students', [StudentController::class, 'index']);
Route::get('/students/{id}', [StudentController::class, 'show']);
Route::put('/students/{id}', [StudentController::class, 'update']);
Route::delete('/students/{id}', [StudentController::class, 'destroy']);

// Absentee Form Route
Route::post('/send-absentee-form', function () {
    $students = \App\Models\Student::all();
    $formUrl = 'https://forms.gle/YOUR_FORM_LINK';
    
    foreach ($students as $student) {
        \Illuminate\Support\Facades\Mail::to($student->email)
            ->send(new \App\Mail\AbsenteeFormMail($formUrl));
    }
    
    return response()->json(['message' => 'Absentee form sent to all students']);
});

// Absent Student Routes
Route::apiResource('absent-students', AbsentStudentController::class);

// Medical Form Routes
Route::apiResource('medical-forms', MedicalFormController::class);
Route::get('students/{studentId}/medical-forms', [MedicalFormController::class, 'studentForms']);