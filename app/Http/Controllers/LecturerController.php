<?php

namespace App\Http\Controllers;

use App\Models\Lecturer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;

class LecturerController extends Controller
{
    public function index()
    {
        $lecturers = Lecturer::all();
        return response()->json($lecturers);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:lecturers',
            'phone' => 'nullable|string|max:20|regex:/^\+?[0-9\s\-]{10,}$/',
            'department' => 'required|string|max:255|in:Computer Science,Mathematics,Physics,Chemistry,Biology',
            'qualification' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'profile_photo' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();
        
        if ($request->hasFile('profile_photo')) {
            $path = $request->file('profile_photo')->store('profile_photos', 'public');
            $data['profile_photo'] = $path;
        }

        $lecturer = Lecturer::create($data);
        return response()->json($lecturer, 201);
    }

    public function show($id)
    {
        $lecturer = Lecturer::findOrFail($id);
        return response()->json($lecturer);
    }

    public function update(Request $request, $id)
    {
        $lecturer = Lecturer::findOrFail($id);
        
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:lecturers,email,'.$id,
            'phone' => 'nullable|string|max:20|regex:/^\+?[0-9\s\-]{10,}$/',
            'department' => 'required|string|max:255|in:Computer Science,Mathematics,Physics,Chemistry,Biology',
            'qualification' => 'required|string|max:255',
            'bio' => 'nullable|string',
            'profile_photo' => 'nullable|image|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $data = $request->all();
        
        if ($request->hasFile('profile_photo')) {
            // Delete old photo if exists
            if ($lecturer->profile_photo) {
                Storage::disk('public')->delete($lecturer->profile_photo);
            }
            
            $path = $request->file('profile_photo')->store('profile_photos', 'public');
            $data['profile_photo'] = $path;
        }

        $lecturer->update($data);
        return response()->json($lecturer);
    }

    public function destroy($id)
    {
        $lecturer = Lecturer::findOrFail($id);
        
        // Delete profile photo if exists
        if ($lecturer->profile_photo) {
            Storage::disk('public')->delete($lecturer->profile_photo);
        }
        
        $lecturer->delete();
        return response()->json(null, 204);
    }
}