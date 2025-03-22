<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;

class StudentController extends Controller
{
    // Store a new student
    public function store(Request $request)
    {
        $request->validate([
            'studentname' => 'required|max:100',
            'department' => 'required|max:100',
        ]);

        $student = new Student();
        $student->studentname = $request->studentname;
        $student->department = $request->department;
        $student->save();

        return response()->json(['message' => 'Student created successfully!'], 201);
    }

    // Retrieve all students
    public function index()
    {
        $students = Student::all();
        return response()->json($students);
    }

    // Retrieve a specific student
    public function show($id)
    {
        $student = Student::findOrFail($id);
        return response()->json($student);
    }

    // Update a student
    public function update(Request $request, $id)
    {
        $student = Student::findOrFail($id);

        $request->validate([
            'studentname' => 'required|max:100',
            'department' => 'required|max:100',
        ]);

        $student->studentname = $request->studentname;
        $student->department = $request->department;
        $student->save();

        return response()->json(['message' => 'Student updated successfully!']);
    }

    // Delete a student
    public function destroy($id)
    {
        $student = Student::findOrFail($id);
        $student->delete();

        return response()->json(['message' => 'Student deleted successfully!']);
    }
}