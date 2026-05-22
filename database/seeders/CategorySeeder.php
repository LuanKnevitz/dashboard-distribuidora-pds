<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Category;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $categories = [
            ['name' => 'Refrigerantes', 'description' => 'Bebidas gaseificadas e refrigeradas'],
            ['name' => 'Águas', 'description' => 'Água mineral e água com gás'],
            ['name' => 'Energéticos', 'description' => 'Bebidas energéticas'],
            ['name' => 'Cervejas', 'description' => 'Bebidas alcoólicas do tipo cerveja'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }
    }
}
