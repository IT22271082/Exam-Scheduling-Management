<?php

namespace App\Http\Controllers;

use App\Models\Lecturer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class LecturerController extends Controller
{
    // Fetch all lecturers
    public function index()
    {
        return response()->json(Lecturer::all());
    }

    // Store a new lecturer
    public function store(Request $request)
    {
        // Step 1: Validate the request
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:lecturers',
            'phone' => 'required|string|regex:/^\d{10}$/',
            'department' => 'required|string|max:255|in:Computer Science (CS),Software Engineering,Information Technology (IT),Artificial Intelligence (AI),Cybersecurity,Data Science',
            'qualification' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'type' => 'required|in:Senior,Junior',
            // 🚫 Removed lecturer_id from validation since it's auto-generated
        ]);

        // Step 2: Return validation errors if any
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Step 3: Use only validated data
        $data = $validator->validated();

        // Step 4: Create the lecturer (lecturer_id is auto-generated in the model)
        $lecturer = Lecturer::create($data);

        // Step 5: Return the new lecturer
        return response()->json($lecturer, 201);
    }

    // Show a specific lecturer by ID
    public function show($id)
    {
        // Get lecturer by ID
        $lecturer = Lecturer::find($id);

        if (!$lecturer) {
            // Return 404 if lecturer not found
            return response()->json(['message' => 'Lecturer not found'], 404);
        }

        // Return the lecturer data as JSON
        return response()->json($lecturer);
    }

    // Update an existing lecturer
    public function update(Request $request, $id)
    {
        // Find the lecturer by ID
        $lecturer = Lecturer::findOrFail($id);

        // Validate incoming request data
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:lecturers,email,'.$id,
            'phone' => 'required|string|regex:/^\d{10}$/',
            'department' => 'required|string|max:255|in:Computer Science (CS),Software Engineering,Information Technology (IT),Artificial Intelligence (AI),Cybersecurity,Data Science',
            'qualification' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'type' => 'required|in:Senior,Junior',
            //'lecturer_id' => 'required|string|unique:lecturers,lecturer_id,' . $lecturer->id, // Ensure lecturer_id is unique and editable
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

    // Delete a lecturer by ID
    public function destroy($id)
    {
        // Find the lecturer by ID
        $lecturer = Lecturer::findOrFail($id);

        // Delete the lecturer record
        $lecturer->delete();

        // Return 204 status code indicating successful deletion
        return response()->json(null, 204);
    }
}
