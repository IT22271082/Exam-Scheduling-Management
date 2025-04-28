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
        Schema::table('students', function (Blueprint $table) {
            if (!Schema::hasColumn('students', 'email')) {
                $table->string('email', 100)->unique()->after('department');
            }
            if (!Schema::hasColumn('students', 'phone')) {
                $table->string('phone', 15)->after('email');
            }
            if (!Schema::hasColumn('students', 'intake_year')) {
                $table->year('intake_year')->after('phone');
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
        Schema::table('students', function (Blueprint $table) {
            if (Schema::hasColumn('students', 'email')) {
                $table->dropColumn('email');
            }
            if (Schema::hasColumn('students', 'phone')) {
                $table->dropColumn('phone');
            }
            if (Schema::hasColumn('students', 'intake_year')) {
                $table->dropColumn('intake_year');
            }
        });
    }
};
