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
// database/migrations/[timestamp]_create_medical_forms_table.php
public function up()
{
    Schema::create('medical_forms', function (Blueprint $table) {
        $table->id();
        $table->foreignId('student_id')->constrained()->onDelete('cascade');
        $table->string('exam_name');
        $table->date('exam_date');
        $table->text('medical_reason');
        $table->string('medical_document'); // path to uploaded file
        $table->date('submission_date');
        $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
        $table->timestamps();
    });
}

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('medical_forms');
    }
};
