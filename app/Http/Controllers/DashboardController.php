<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function __invoke()
    {
        return Inertia::render('dashboard', [
            'stats' => [
                'total_orders'   => Order::count(),
                'pending_orders' => Order::whereDoesntHave('approval')->count(),
                'total_products' => Product::count(),
                'total_revenue'  => Order::whereHas('approval', fn($q) => $q->where('status', 'approved'))
                    ->sum('total_price'),
            ],
            'recent_orders' => Order::with(['items.product', 'approval'])
                ->latest()
                ->limit(5)
                ->get(),
        ]);
    }
}
