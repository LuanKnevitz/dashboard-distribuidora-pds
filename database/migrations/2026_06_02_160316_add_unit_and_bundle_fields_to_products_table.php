<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->decimal('unit_price', 10, 2)->nullable()->after('description');
            $table->decimal('bundle_price', 10, 2)->nullable()->after('unit_price');
            $table->unsignedInteger('units_per_bundle')->nullable()->after('bundle_price');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('products', function (Blueprint $table) {
            $table->dropColumn([
                'unit_price',
                'bundle_price',
                'units_per_bundle',
            ]);
        });
    }
};