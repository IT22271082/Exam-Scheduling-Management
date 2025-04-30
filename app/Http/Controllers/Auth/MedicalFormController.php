<?php
namespace App\Http\Controllers;

use App\Models\MedicalForm;
use App\Models\Student;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class MedicalFormController extends Controller
{
    // Get all medical forms (admin view)
    public function index()
    {
        $forms = MedicalForm::with('student')
            ->latest()
            ->get();
            
        return response()->json($forms);
    }

    // Submit new medical form
    public function store(Request $request)
    {
        $validated = $request->validate([
            'student_id' => 'required|exists:students,id',
            'exam_name' => 'required|string|max:255',
            'exam_date' => 'required|date',
            'medical_reason' => 'required|string|max:500',
            'medical_document' => 'required|file|mimes:pdf,jpg,png|max:2048',
            'submission_date' => 'required|date'
        ]);

        $documentPath = $request->file('medical_document')->store('medical_documents');

        $form = MedicalForm::create([
            'student_id' => $validated['student_id'],
            'exam_name' => $validated['exam_name'],
            'exam_date' => $validated['exam_date'],
            'medical_reason' => $validated['medical_reason'],
            'medical_document' => $documentPath,
            'submission_date' => $validated['submission_date'],
            'status' => 'pending'
        ]);

        return response()->json($form, 201);
    }

    // Approve medical form
    public function approve($id)
    {
        $form = MedicalForm::findOrFail($id);
        $form->update(['status' => 'approved']);
        
        // Create corresponding absence record
        AbsentStudent::create([
            'student_id' => $form->student_id,
            'exam_id' => $this->findExamId($form->exam_name, $form->exam_date),
            'reason' => $form->medical_reason,
            'document_path' => $form->medical_document,
            'status' => AbsentStudent::STATUS_APPROVED,
            'approved_by' => auth()->id(),
            'approved_at' => now()
        ]);

        return response()->json($form);
    }

    // Reject medical form
    public function reject(Request $request, $id)
    {
        $form = MedicalForm::findOrFail($id);
        
        $validated = $request->validate([
            'admin_notes' => 'required|string|max:500'
        ]);

        $form->update([
            'status' => 'rejected',
            'admin_notes' => $validated['admin_notes']
        ]);

        return response()->json($form);
    }

    // Helper method to find exam ID (you may need to adjust this)
    protected function findExamId($examName, $examDate)
    {
        return Exam::where('name', $examName)
            ->whereDate('date', $examDate)
            ->value('id');
    }
}