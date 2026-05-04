<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ProductController extends Controller
{
    public function index()
    {
        return Inertia::render('products/index', [
            'products' => Product::latest()->get(),
        ]);
    }

    public function create()
    {
        return Inertia::render('products/create');
    }

    public function store(Request $request)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'unit'        => 'required|string|max:50',
        ]);

        Product::create($request->only('name', 'description', 'price', 'stock', 'unit'));

        return redirect()->route('products.index');
    }

    public function edit(Product $product)
    {
        return Inertia::render('products/edit', ['product' => $product]);
    }

    public function update(Request $request, Product $product)
    {
        $request->validate([
            'name'        => 'required|string|max:255',
            'description' => 'nullable|string',
            'price'       => 'required|numeric|min:0',
            'stock'       => 'required|integer|min:0',
            'unit'        => 'required|string|max:50',
        ]);

        $product->update($request->only('name', 'description', 'price', 'stock', 'unit'));

        return redirect()->route('products.index');
    }

    public function destroy(Product $product)
    {
        $product->delete(); // soft delete

        return redirect()->route('products.index');
    }
}
