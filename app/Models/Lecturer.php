<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Lecturer extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'email',
        'phone',
        'department',
        'qualification',
        'bio',
        'profile_photo',
        'type', // New: Senior or Junior
        'lecturer_id' // New: Auto-generated ID
    ];

    // Automatically generate lecturer ID before saving
    public static function boot()
    {
        parent::boot();

        static::creating(function ($lecturer) {
            $lecturer->lecturer_id = self::generateLecturerID($lecturer->type);
        });
    }

    private static function generateLecturerID($type)
    {
        $prefix = ($type === 'Senior') ? 'SEN' : 'JUN';

        // Get the last assigned ID for this type
        $latestLecturer = self::where('type', $type)
            ->orderBy('id', 'desc')
            ->first();

        // Extract last number
        $lastNumber = $latestLecturer ? (int)substr($latestLecturer->lecturer_id, 4) : 0;

        // Increment and format as 3-digit number
        $newNumber = str_pad($lastNumber + 1, 3, '0', STR_PAD_LEFT);

        return "{$prefix}-{$newNumber}";
    }
}
