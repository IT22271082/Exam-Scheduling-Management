<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class ResourceAllocation extends Model
{
    use HasFactory;

    protected $fillable = [
        'resource_name',
        'resource_type',
        'allocation_date',
        'start_time',
        'end_time',
        'duration',
        'status',
        'capacity',
        'exam_name',
        'notes'
    ];

    protected $casts = [
        'allocation_date' => 'datetime',
        'capacity' => 'integer',
        'duration' => 'integer'
    ];

    protected static function boot()
    {
        parent::boot();

        static::saving(function ($model) {
            // Calculate duration automatically
            if ($model->start_time && $model->end_time) {
                $start = Carbon::parse($model->start_time);
                $end = Carbon::parse($model->end_time);
                $model->duration = $start->diffInMinutes($end);
            }
            
            // Combine date and time for allocation_date
            if ($model->allocation_date && $model->start_time) {
                $model->allocation_date = Carbon::parse($model->allocation_date)
                    ->setTimeFromTimeString($model->start_time);
            }
        });
    }

    // Accessor for formatted duration
    public function getFormattedDurationAttribute()
    {
        $hours = floor($this->duration / 60);
        $minutes = $this->duration % 60;
        return sprintf('%dh %dm', $hours, $minutes);
    }
}