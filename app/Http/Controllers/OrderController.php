<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index(Request $request)
    {
        $orders = null;

        if ($request->filled('phone')) {
            $orders = Order::with(['items.product', 'approval'])
                ->where('guest_phone', $request->phone)
                ->latest()
                ->get();
        }

        return Inertia::render('orders/index', ['orders' => $orders]);
    }

    public function create()
    {
        return Inertia::render('orders/create', [
            'products' => Product::where('stock', '>', 0)->get(),
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'guest_name'         => 'required|string|max:255',
            'guest_phone'        => 'required|string|max:20',
            'items'              => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.qty'        => 'required|integer|min:1',
            'notes'              => 'nullable|string',
        ]);

        $total = 0;
        $items = [];

        foreach ($request->items as $item) {
            $product = Product::findOrFail($item['product_id']);
            $price   = $product->price;
            $total  += $price * $item['qty'];
            $items[] = [
                'product_id' => $product->id,
                'qty'        => $item['qty'],
                'price'      => $price,
            ];
        }

        $order = Order::create([
            'guest_name'  => $request->guest_name,
            'guest_phone' => $request->guest_phone,
            'total_price' => $total,
            'notes'       => $request->notes,
        ]);

        $order->items()->createMany($items);

        return redirect()->route('orders.show', $order);
    }

    public function show(Order $order)
    {
        $order->load(['items.product', 'approval']);

        return Inertia::render('orders/show', ['order' => $order]);
    }

    public function destroy(Order $order)
    {
        abort_if($order->approval !== null, 403, 'Cannot delete a processed order.');

        $order->items()->delete();
        $order->delete();

        return redirect()->route('home');
    }
}
