<?php

use App\Http\Controllers\AdminOrderController;
use App\Http\Controllers\ApprovalController;
use App\Http\Controllers\BannerController;
use App\Http\Controllers\CatalogController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;

// ─── Guest Routes (no login required) ────────────────────────────────────────

// Dashboard / beranda: banner + produk ready stok
Route::get('/', [CatalogController::class, 'index'])->name('home');

// Katalog produk
Route::get('/catalog', [CatalogController::class, 'index'])->name('catalog.index');

// Pre-order: form pemesanan
Route::get('/order', [OrderController::class, 'create'])->name('orders.create');
Route::post('/order', [OrderController::class, 'store'])->name('orders.store');

// Cek status order berdasarkan no. HP
Route::get('/orders', [OrderController::class, 'index'])->name('orders.index');

// Detail order (pakai kode order)
Route::get('/orders/{order:public_code}', [OrderController::class, 'show'])->name('orders.show');

// ─── Admin Routes (login required) ───────────────────────────────────────────

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('/dashboard', DashboardController::class)->name('dashboard');

    Route::middleware('can:admin')->group(function () {
        // Products
        Route::resource('products', ProductController::class)->except(['show']);

        // Orders
        Route::get('admin/orders', [AdminOrderController::class, 'index'])->name('admin.orders.index');

        // Banners
        Route::resource('banners', BannerController::class)->except(['show', 'create', 'edit']);

        // Approvals
        Route::get('approvals', [ApprovalController::class, 'index'])->name('approvals.index');
        Route::post('approvals/{order}/approve', [ApprovalController::class, 'approve'])->name('approvals.approve');
        Route::post('approvals/{order}/reject', [ApprovalController::class, 'reject'])->name('approvals.reject');
    });
});

require __DIR__.'/settings.php';
