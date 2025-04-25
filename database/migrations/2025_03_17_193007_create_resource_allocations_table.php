<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('resource_allocations', function (Blueprint $table) {
            $table->id();
            $table->string('resource_name');
            $table->string('resource_type');
            $table->dateTime('allocation_date');
            $table->integer('duration'); // Duration in minutes
            $table->string('status')->default('available');
            $table->timestamps();
        });
    }

    public function down()
    {
        Schema::dropIfExists('resource_allocations');
    }
};