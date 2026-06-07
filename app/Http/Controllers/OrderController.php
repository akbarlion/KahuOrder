<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Inertia\Response;

class OrderController extends Controller
{
    public function index(Request $request): Response
    {
        $orders = null;

        if ($request->filled('phone')) {
            $orders = Order::with(['items.product', 'approval'])
                ->where('guest_phone', $this->normalizePhone($request->string('phone')->toString()))
                ->latest()
                ->get();
        }

        return Inertia::render('orders/index', ['orders' => $orders]);
    }

    public function create(): Response
    {
        return Inertia::render('orders/create', [
            'products' => Product::where('stock', '>', 0)->get(),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'guest_name' => 'required|string|max:255',
            'guest_phone' => 'required|string|max:20',
            'items' => 'required|array|min:1',
            'items.*.product_id' => [
                'required',
                Rule::exists('products', 'id')->whereNull('deleted_at'),
            ],
            'items.*.qty' => 'required|integer|min:1',
            'notes' => 'nullable|string|max:2000',
        ]);

        $order = DB::transaction(function () use ($validated) {
            $quantities = collect($validated['items'])
                ->groupBy('product_id')
                ->map(fn ($items) => $items->sum('qty'));

            $products = Product::whereIn('id', $quantities->keys())
                ->lockForUpdate()
                ->get()
                ->keyBy('id');

            foreach ($quantities as $productId => $qty) {
                $product = $products->get((int) $productId);

                if (! $product || $product->stock < $qty) {
                    throw ValidationException::withMessages([
                        'items' => 'Stok produk tidak cukup. Silakan cek ulang pesanan.',
                    ]);
                }
            }

            $total = 0;
            $items = [];

            foreach ($quantities as $productId => $qty) {
                $product = $products->get((int) $productId);
                $price = $product->price;
                $total += $price * $qty;

                $items[] = [
                    'product_id' => $product->id,
                    'qty' => $qty,
                    'price' => $price,
                ];

                $product->decrement('stock', $qty);
            }

            $order = Order::create([
                'guest_name' => $validated['guest_name'],
                'guest_phone' => $this->normalizePhone($validated['guest_phone']),
                'total_price' => $total,
                'notes' => $validated['notes'] ?? null,
            ]);

            $order->items()->createMany($items);

            return $order;
        });

        return redirect()->route('orders.show', $order->public_code);
    }

    public function show(Order $order): Response
    {
        $order->load(['items.product', 'approval']);

        return Inertia::render('orders/show', ['order' => $order]);
    }

    public function destroy(Order $order): RedirectResponse
    {
        abort_if($order->approval !== null, 403, 'Cannot delete a processed order.');

        DB::transaction(function () use ($order) {
            $order->load('items.product');

            foreach ($order->items as $item) {
                $item->product?->increment('stock', $item->qty);
            }

            $order->items()->delete();
            $order->delete();
        });

        return redirect()->route('home');
    }

    private function normalizePhone(string $phone): string
    {
        return preg_replace('/\D+/', '', $phone) ?? '';
    }
}
