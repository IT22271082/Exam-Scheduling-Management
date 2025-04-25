<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::table('resource_allocations', function (Blueprint $table) {
            // Add exam_name column if not exists
            if (!Schema::hasColumn('resource_allocations', 'exam_name')) {
                $table->string('exam_name')->nullable()->after('resource_type');
            }
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::table('resource_allocations', function (Blueprint $table) {
            // Drop the exam_name column if it exists
            if (Schema::hasColumn('resource_allocations', 'exam_name')) {
                $table->dropColumn('exam_name');
            }
        });
    }
};