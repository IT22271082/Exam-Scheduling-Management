<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\AbsentStudent;

class AbsentStudentController extends Controller
{
    /**
     * Display a listing of absent student records.
     */
    public function index()
    {
        $absentStudents = AbsentStudent::all();
        return response()->json($absentStudents);
    }

    /**
     * Store a newly created absent student record.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'exam_id' => 'required|exists:exams,id',
            'reason' => 'required|string|max:255',
            'document_path' => 'nullable|string',
            'status' => 'required|in:pending,approved,rejected'
        ]);

        $absentStudent = AbsentStudent::create($validated);

        return response()->json($absentStudent, 201);
    }

    /**
     * Display the specified absent student record.
     */
    public function show(AbsentStudent $absentStudent)
    {
        return response()->json($absentStudent);
    }

    /**
     * Update the specified absent student record.
     */
    public function update(Request $request, AbsentStudent $absentStudent)
    {
        $validated = $request->validate([
            'student_id' => 'sometimes|exists:students,id',
            'exam_id' => 'sometimes|exists:exams,id',
            'reason' => 'sometimes|string|max:255',
            'document_path' => 'nullable|string',
            'status' => 'sometimes|in:pending,approved,rejected'
        ]);

        $absentStudent->update($validated);

        return response()->json($absentStudent);
    }

    /**
     * Remove the specified absent student record.
     */
    public function destroy(AbsentStudent $absentStudent)
    {
        $absentStudent->delete();
        return response()->json(null, 204);
    }
}