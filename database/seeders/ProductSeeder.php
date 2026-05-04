<?php

namespace Database\Seeders;

use App\Models\Product;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        //
        $products = [
            ['name' => 'Keranjang Panen', 'price' => 50000, 'stock' => 100, 'unit' => 'pcs'],
            ['name' => 'Pupuk Organik', 'price' => 75000, 'stock' => 50, 'unit' => 'kg'],
            ['name' => 'Bibit Cabai', 'price' => 20000, 'stock' => 200, 'unit' => 'pack'],
            ['name' => 'Pupuk NPK', 'price' => 85000, 'stock' => 75, 'unit' => 'kg'],
            ['name' => 'Sprayer Manual', 'price' => 150000, 'stock' => 30, 'unit' => 'pcs'],
            ['name' => 'Selang Air 10m', 'price' => 60000, 'stock' => 40, 'unit' => 'pcs'],
            ['name' => 'Cangkul', 'price' => 90000, 'stock' => 25, 'unit' => 'pcs'],
        ];

        foreach ($products as $product) {
            Product::create($product);
        }
    }
}
