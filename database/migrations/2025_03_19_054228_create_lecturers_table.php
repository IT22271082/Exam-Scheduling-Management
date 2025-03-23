<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    public function up()
{
    Schema::create('lecturers', function (Blueprint $table) {
        $table->id();
        $table->string('name');
        $table->string('email')->unique();
        $table->string('phone')->nullable();
        $table->string('department');
        $table->string('qualification');
        $table->text('bio')->nullable();
        $table->string('type'); // Add this for Senior/Junior classification
        $table->string('lecturer_id')->unique(); // Auto-generated ID
        $table->timestamps();
    });
}

    public function down()
    {
        Schema::dropIfExists('lecturers');
    }
};
