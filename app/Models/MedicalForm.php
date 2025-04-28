<?php

// app/Models/MedicalForm.php
namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MedicalForm extends Model
{
    use HasFactory;

    protected $fillable = [
        'student_id',
        'exam_name',
        'exam_date',
        'medical_reason',
        'medical_document',
        'submission_date',
        'status'
    ];

    protected $casts = [
        'exam_date' => 'date',
        'submission_date' => 'date'
    ];

    public function student()
    {
        return $this->belongsTo(Student::class);
    }
}