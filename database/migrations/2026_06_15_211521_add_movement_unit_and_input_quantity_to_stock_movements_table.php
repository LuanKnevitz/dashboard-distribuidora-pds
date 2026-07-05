<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('stock_movements', function (Blueprint $table) {
            $table->enum('movement_unit', ['unit', 'bundle'])
                ->default('unit')
                ->after('type');

            $table->integer('input_quantity')
                ->default(0)
                ->after('movement_unit');
        });
    }

    public function down(): void
    {
        Schema::table('stock_movements', function (Blueprint $table) {
            $table->dropColumn(['movement_unit', 'input_quantity']);
        });
    }
};