<?php

namespace App\Http\Controllers;

use App\Models\Lecturer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LecturerController extends Controller
{
    public function index()
    {
        // Get all lecturers and return as JSON
        $lecturers = Lecturer::all();
        return response()->json($lecturers);
    }

    public function store(Request $request)
    {
        // Validate incoming request data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:lecturers',
            'phone' => 'required|string|regex:/^\d{10}$/',
            'department' => 'required|string|max:255|in:Computer Science,Software Engineering,Information Technology,Artificial Intelligence,Cybersecurity,Data Science',
            'qualification' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'type' => 'required|in:Senior,Junior',
        ]);

        // Return validation errors if any
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Create lecturer record without photo
        $data = $request->all();
        $lecturer = Lecturer::create($data);
        return response()->json($lecturer, 201);
    }

    public function show($id)
    {
        // Get lecturer by ID
        $lecturer = Lecturer::findOrFail($id);
        return response()->json($lecturer);
    }

    public function update(Request $request, $id)
    {
        // Find the lecturer by ID
        $lecturer = Lecturer::findOrFail($id);

        // Validate incoming request data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:lecturers,email,'.$id,
            'phone' => 'required|string|regex:/^\d{10}$/',
            'department' => 'required|string|max:255|in:Computer Science,Software Engineering,Information Technology,Artificial Intelligence,Cybersecurity,Data Science',
            'qualification' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'type' => 'required|in:Senior,Junior',
        ]);

        // Return validation errors if any
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Update lecturer record without handling profile photo
        $data = $request->all();
        $lecturer->update($data);

        return response()->json($lecturer);
    }

    public function destroy($id)
    {
        // Find the lecturer by ID
        $lecturer = Lecturer::findOrFail($id);

        // Delete the lecturer record
        $lecturer->delete();
        return response()->json(null, 204);
    }
}
