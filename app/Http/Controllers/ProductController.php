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
            'image'       => 'nullable|image|max:2048',
        ]);

        $data = $request->only('name', 'description', 'price', 'stock', 'unit');
        if ($request->hasFile('image')) {
            $data['image_url'] = $request->file('image')->store('products', 'public');
        }

        Product::create($data);

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
            'image'       => 'nullable|image|max:2048',
        ]);

        $data = $request->only('name', 'description', 'price', 'stock', 'unit');
        if ($request->hasFile('image')) {
            if ($product->image_url) {
                \Storage::disk('public')->delete($product->image_url);
            }
            $data['image_url'] = $request->file('image')->store('products', 'public');
        }

        $product->update($data);

        return redirect()->route('products.index');
    }

    public function destroy(Product $product)
    {
        if ($product->image_url) {
            \Storage::disk('public')->delete($product->image_url);
        }
        $product->delete();

        return redirect()->route('products.index');
    }
}
