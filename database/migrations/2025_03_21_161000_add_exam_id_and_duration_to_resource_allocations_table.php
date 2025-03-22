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
            // Add exam_id as a foreign key (assuming you have an exams table)
            $table->unsignedBigInteger('exam_id')->nullable()->after('resource_type');
            $table->foreign('exam_id')->references('id')->on('exams')->onDelete('set null');

            // Add duration as an integer (in minutes)
            $table->integer('duration')->nullable()->after('allocation_date');
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
            // Drop the foreign key and columns
            $table->dropForeign(['exam_id']);
            $table->dropColumn('exam_id');
            $table->dropColumn('duration');
        });
    }
};