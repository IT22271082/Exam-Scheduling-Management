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
            // Modify existing duration column to be nullable
            $table->integer('duration')->nullable()->change();

            // Add start_time column if not exists
            if (!Schema::hasColumn('resource_allocations', 'start_time')) {
                $table->time('start_time')->nullable()->after('duration');
            }

            // Add end_time column if not exists
            if (!Schema::hasColumn('resource_allocations', 'end_time')) {
                $table->time('end_time')->nullable()->after('start_time');
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
            // Drop the columns if they exist
            if (Schema::hasColumn('resource_allocations', 'start_time')) {
                $table->dropColumn('start_time');
            }

            if (Schema::hasColumn('resource_allocations', 'end_time')) {
                $table->dropColumn('end_time');
            }
        });
    }
};