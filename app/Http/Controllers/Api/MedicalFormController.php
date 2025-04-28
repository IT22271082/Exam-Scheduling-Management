<?php

namespace App\Http\Controllers;

use App\Models\MedicalForm;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MedicalFormController extends Controller
{
    public function store(Request $request)
    {
        try {
            // Validate the request
            $validated = $request->validate([
                'student_id' => 'required|exists:students,id',
                'exam_name' => 'required|string|max:255',
                'exam_date' => 'required|date',
                'medical_reason' => 'required|string',
                'medical_document' => 'required|file|mimes:pdf,jpg,png|max:2048',
            ]);

            // Handle file upload
            if ($request->hasFile('medical_document')) {
                $path = $request->file('medical_document')
                    ->store('medical_documents', 'public');
            } else {
                return response()->json([
                    'error' => 'Medical document is required'
                ], 422);
            }

            // Create the medical form
            $medicalForm = MedicalForm::create([
                'student_id' => $request->student_id,
                'exam_name' => $request->exam_name,
                'exam_date' => $request->exam_date,
                'medical_reason' => $request->medical_reason,
                'medical_document' => $path,
                'submission_date' => now(),
                'status' => 'pending',
            ]);

            return response()->json($medicalForm, 201);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'error' => 'Validation Error',
                'messages' => $e->errors()
            ], 422);
            
        } catch (\Exception $e) {
            \Log::error('Medical form submission error: ' . $e->getMessage());
            return response()->json([
                'error' => 'Server Error',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}