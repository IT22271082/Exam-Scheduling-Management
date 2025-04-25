<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::table('resource_allocations', function (Blueprint $table) {
            // Add each column only if it doesn't exist
            if (!Schema::hasColumn('resource_allocations', 'start_time')) {
                $table->time('start_time')->after('allocation_date');
            }
            
            if (!Schema::hasColumn('resource_allocations', 'end_time')) {
                $table->time('end_time')->after('start_time');
            }
            
            if (!Schema::hasColumn('resource_allocations', 'duration')) {
                $table->integer('duration')->after('end_time');
            }
            
            if (!Schema::hasColumn('resource_allocations', 'exam_name')) {
                $table->string('exam_name')->after('duration');
            }
            
            if (!Schema::hasColumn('resource_allocations', 'capacity')) {
                $table->integer('capacity')->default(30)->after('exam_name');
            }
            
            if (!Schema::hasColumn('resource_allocations', 'notes')) {
                $table->text('notes')->nullable()->after('capacity');
            }
        });
    }

    public function down()
    {
        // We intentionally leave this empty to prevent accidental column removal
        // in production environments
    }
};