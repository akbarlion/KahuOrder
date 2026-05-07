<?php

namespace App\Http\Controllers;

use App\Models\Banner;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BannerController extends Controller
{
    public function index()
    {
        return Inertia::render('banners/index', [
            'banners' => Banner::orderBy('order')->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'title'     => 'required|string|max:255',
            'image_url' => 'required|url|max:2048',
            'link_url'  => 'nullable|url|max:2048',
            'is_active' => 'boolean',
            'order'     => 'integer|min:0',
        ]);

        Banner::create($request->only('title', 'image_url', 'link_url', 'is_active', 'order'));

        return redirect()->route('banners.index');
    }

    public function update(Request $request, Banner $banner)
    {
        $request->validate([
            'title'     => 'required|string|max:255',
            'image_url' => 'required|url|max:2048',
            'link_url'  => 'nullable|url|max:2048',
            'is_active' => 'boolean',
            'order'     => 'integer|min:0',
        ]);

        $banner->update($request->only('title', 'image_url', 'link_url', 'is_active', 'order'));

        return redirect()->route('banners.index');
    }

    public function destroy(Banner $banner)
    {
        $banner->delete();

        return redirect()->route('banners.index');
    }
}
