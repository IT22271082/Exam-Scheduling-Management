<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ResourceAllocation extends Model
{
    use HasFactory;

    // Fields that can be mass-assigned
    protected $fillable = [
        'resource_name',
        'resource_type',
        'exam_id', // Add exam_id to link resources to exams
        'allocation_date',
        'duration', // Add duration to specify how long the resource is needed
        'status',
    ];

    // Cast allocation_date to a datetime object
    protected $casts = [
        'allocation_date' => 'datetime',
    ];

   
}