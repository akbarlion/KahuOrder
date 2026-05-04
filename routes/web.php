<?php

use App\Http\Controllers\ApprovalController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProductController;
use Illuminate\Support\Facades\Route;
use Laravel\Fortify\Features;

Route::inertia('/', 'welcome', [
    'canRegister' => Features::enabled(Features::registration()),
])->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');

    // Orders — semua user yang login
    Route::resource('orders', OrderController::class)
        ->only(['index', 'create', 'store', 'show', 'destroy']);

    // Products & Approvals — admin only
    Route::middleware('can:admin')->group(function () {
        Route::resource('products', ProductController::class)
            ->except(['show']);

        Route::get('approvals', [ApprovalController::class, 'index'])->name('approvals.index');
        Route::post('approvals/{order}/approve', [ApprovalController::class, 'approve'])->name('approvals.approve');
        Route::post('approvals/{order}/reject', [ApprovalController::class, 'reject'])->name('approvals.reject');
    });
});

require __DIR__ . '/settings.php';
