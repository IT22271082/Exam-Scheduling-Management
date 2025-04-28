<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\ExamSchedule;

class ExamScheduleController extends Controller
{
    public function index()
    {
        return response()->json(ExamSchedule::all());
    }

    public function store(Request $request)
    {
        $request->validate([
            'module_code' => 'required|string',
            'exam_date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required',
            'location' => 'required|string'
        ]);

        $examSchedule = ExamSchedule::create($request->all());
        return response()->json($examSchedule);
    }

    // ✅ Fetch a single schedule for editing
    public function show($id)
    {
        $schedule = ExamSchedule::find($id);
        if (!$schedule) {
            return response()->json(['error' => 'Schedule not found'], 404);
        }
        return response()->json($schedule);
    }

    // ✅ Update the schedule details
    public function update(Request $request, $id)
    {
        $request->validate([
            'module_code' => 'required|string',
            'exam_date' => 'required|date',
            'start_time' => 'required',
            'end_time' => 'required',
            'location' => 'required|string'
        ]);

        $schedule = ExamSchedule::findOrFail($id);
        $schedule->update($request->all());

        return response()->json(['message' => 'Schedule updated successfully', 'data' => $schedule]);
    }

    public function destroy($id)
    {
        try {
            $schedule = ExamSchedule::findOrFail($id);
            $schedule->delete();

            return response()->json(['message' => 'Deleted successfully'], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Deletion failed', 'message' => $e->getMessage()], 500);
        }
    }
}
