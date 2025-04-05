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

    // Function to generate a random 4-digit lecturer ID with type
    private static function generateLecturerID($type)
    {
        $prefix = ($type === 'Senior') ? 'SEN' : 'JUN';

        // Generate a random 4-digit number (between 1000 and 9999)
        $randomNumber = rand(1000, 9999);

        // Check if the generated ID already exists
        while (self::where('lecturer_id', "{$prefix}-{$randomNumber}")->exists()) {
            // Regenerate the number if it already exists
            $randomNumber = rand(1000, 9999);
        }

        return "{$prefix}-{$randomNumber}";
    }
}
