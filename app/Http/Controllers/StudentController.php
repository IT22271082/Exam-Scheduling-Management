<?php

namespace App\Http\Controllers;

use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class StudentController extends Controller
{
    // Get all students
    public function index()
    {
        $students = Student::all();
        return response()->json($students);
    }

    // Create a new student
    public function store(Request $request)
    {
        $validDepartments = [
            'Computer Science',
            'Network Engineering',
            'Software Engineering',
            'Cyber Security',
            'Interactive Media',
            'Data Science',
            'Information Technology'
        ];
    
        $request->validate([
            'studentname' => 'required|string|max:100|regex:/^[A-Za-z\s]+$/',
            'department' => [
                'required',
                'string',
                Rule::in($validDepartments)
            ],
            'email' => 'required|email|unique:students,email',
            'phone' => 'required|string|regex:/^(\+\d{1,3})?\d{10}$/|unique:students,phone',
            'intake_year' => 'required|integer|min:1900|max:' . date('Y'),
        ], [
            'email.unique' => 'Email already exists',
            'phone.unique' => 'Phone number already exists'
        ]);
    
        $student = Student::create($request->all());
        return response()->json($student, 201);
    }

    // Get a specific student by ID
    public function show($id)
    {
        $student = Student::find($id);
        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }
        return response()->json($student);
    }

    // Update a student
    public function update(Request $request, $id)
    {
        $student = Student::find($id);
        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        $request->validate([
            'studentname' => 'sometimes|string|max:100',
            'department' => 'sometimes|string|max:100',
            'email' => 'sometimes|email|unique:students,email,' . $student->id,
            'phone' => 'sometimes|string|max:15',
            'intake_year' => 'sometimes|integer|min:1900|max:' . date('Y'),
        ]);

        $student->update($request->all());
        return response()->json($student);
    }

    // Delete a student
    public function destroy($id)
    {
        $student = Student::find($id);
        if (!$student) {
            return response()->json(['message' => 'Student not found'], 404);
        }

        $student->delete();
        return response()->json(['message' => 'Student deleted']);
    }

}
