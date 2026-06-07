<?php

namespace App\Http\Controllers;

use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class AdminOrderController extends Controller
{
    public function index(Request $request): Response
    {
        $validated = $request->validate([
            'search' => 'nullable|string|max:100',
            'status' => 'nullable|in:all,pending,approved,rejected',
        ]);

        $status = $validated['status'] ?? 'all';
        $search = $validated['search'] ?? null;

        $orders = Order::query()
            ->with(['items.product', 'approval'])
            ->when($search, function ($query, string $search) {
                $query->where(function ($query) use ($search) {
                    $query->where('public_code', 'like', "%{$search}%")
                        ->orWhere('guest_name', 'like', "%{$search}%")
                        ->orWhere('guest_phone', 'like', "%{$search}%");
                });
            })
            ->when($status === 'pending', fn ($query) => $query->whereDoesntHave('approval'))
            ->when(
                in_array($status, ['approved', 'rejected'], true),
                fn ($query) => $query->whereHas('approval', fn ($query) => $query->where('status', $status))
            )
            ->latest()
            ->paginate(15)
            ->withQueryString();

        return Inertia::render('admin/orders/index', [
            'orders' => $orders,
            'filters' => [
                'search' => $search ?? '',
                'status' => $status,
            ],
            'summary' => [
                'all' => Order::count(),
                'pending' => Order::whereDoesntHave('approval')->count(),
                'approved' => Order::whereHas('approval', fn ($query) => $query->where('status', 'approved'))->count(),
                'rejected' => Order::whereHas('approval', fn ($query) => $query->where('status', 'rejected'))->count(),
            ],
        ]);
    }
}
