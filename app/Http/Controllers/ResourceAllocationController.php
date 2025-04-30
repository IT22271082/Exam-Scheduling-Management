<?php

namespace App\Http\Controllers;

use App\Models\ResourceAllocation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class ResourceAllocationController extends Controller
{
    public function index()
    {
        return ResourceAllocation::orderBy('allocation_date', 'desc')->get();
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'resource_name' => 'required|string|max:255',
            'resource_type' => 'required|in:classroom,lab,auditorium,equipment',
            'allocation_date' => 'required|date',
            'start_time' => 'required|date_format:H:i',
            'end_time' => 'required|date_format:H:i|after:start_time',
            'exam_name' => 'required|string|max:255',
            'capacity' => 'required|integer|min:1',
            'status' => 'required|in:available,allocated,maintenance',
            'notes' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();
        $allocation = ResourceAllocation::create($data);

        return response()->json($allocation, 201);
    }

    public function show($id)
    {
        $allocation = ResourceAllocation::findOrFail($id);
        return response()->json($allocation);
    }

    public function update(Request $request, $id)
    {
        $allocation = ResourceAllocation::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'resource_name' => 'sometimes|required|string|max:255',
            'resource_type' => 'sometimes|required|in:classroom,lab,auditorium,equipment',
            'allocation_date' => 'sometimes|required|date',
            'start_time' => 'sometimes|required|date_format:H:i',
            'end_time' => 'sometimes|required|date_format:H:i|after:start_time',
            'exam_name' => 'sometimes|required|string|max:255',
            'capacity' => 'sometimes|required|integer|min:1',
            'status' => 'sometimes|required|in:available,allocated,maintenance',
            'notes' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'errors' => $validator->errors()
            ], 422);
        }

        $allocation->update($validator->validated());
        return response()->json($allocation);
    }

    public function destroy($id)
    {
        $allocation = ResourceAllocation::findOrFail($id);
        $allocation->delete();
        return response()->json(null, 204);
    }
}