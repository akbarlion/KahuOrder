<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use App\Models\Product;
use Inertia\Inertia;

class CatalogController extends Controller
{
    public function index()
    {
        return Inertia::render('catalog/index', [
            'banners'  => Banner::where('is_active', true)->orderBy('order')->get(),
            'products' => Product::where('stock', '>', 0)->latest()->get(),
        ]);
    }
}
