<?php

namespace App\Http\Controllers;

use App\Models\ResourceAllocation;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class ResourceAllocationController extends Controller
{
    // Fetch all resource allocations
    public function index()
    {
        try {
            return ResourceAllocation::all();
        } catch (\Exception $e) {
            Log::error('Error fetching resources: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to fetch resources'], 500);
        }
    }

    // Create a new resource allocation
    public function store(Request $request)
    {
        try {
            // Validate the request data
            $validated = $request->validate([
                'resource_name' => 'required|string',
                'resource_type' => 'required|string',
                'exam_id' => 'required|string', // Changed from 'exists:exams,id'
                'allocation_date' => 'required|date',
                'duration' => 'required|integer|min:1', // Duration in minutes
                'status' => 'required|string|in:available,allocated', // Validate status
            ]);

            // Format the date correctly for MySQL
            $validated['allocation_date'] = date('Y-m-d H:i:s', strtotime($request->allocation_date));

            // Create the resource allocation
            $resource = ResourceAllocation::create($validated);

            return response()->json($resource, 201);
        } catch (\Exception $e) {
            Log::error('Error creating resource: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    // Fetch a single resource allocation
    public function show($id)
    {
        try {
            $resourceAllocation = ResourceAllocation::findOrFail($id);
            return response()->json($resourceAllocation);
        } catch (\Exception $e) {
            Log::error('Error fetching resource: ' . $e->getMessage());
            return response()->json(['error' => 'Resource not found'], 404);
        }
    }

    // Update an existing resource allocation
    public function update(Request $request, $id)
    {
        try {
            $resourceAllocation = ResourceAllocation::findOrFail($id);
            
            // Validate the request data
            $validated = $request->validate([
                'resource_name' => 'required|string',
                'resource_type' => 'required|string',
                'exam_id' => 'required|string', // Changed from 'exists:exams,id'
                'allocation_date' => 'required|date',
                'duration' => 'required|integer|min:1', // Duration in minutes
                'status' => 'required|string|in:available,allocated', // Validate status
            ]);

            // Format the date correctly for MySQL
            $validated['allocation_date'] = date('Y-m-d H:i:s', strtotime($request->allocation_date));

            // Update the resource allocation
            $resourceAllocation->update($validated);

            return response()->json($resourceAllocation);
        } catch (\Exception $e) {
            Log::error('Error updating resource: ' . $e->getMessage());
            return response()->json(['error' => $e->getMessage()], 422);
        }
    }

    // Delete a resource allocation
    public function destroy($id)
    {
        try {
            $resourceAllocation = ResourceAllocation::findOrFail($id);
            $resourceAllocation->delete();
            return response()->json(null, 204);
        } catch (\Exception $e) {
            Log::error('Error deleting resource: ' . $e->getMessage());
            return response()->json(['error' => 'Failed to delete resource'], 500);
        }
    }
}