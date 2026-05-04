<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        $orders = Order::with(['user', 'approval'])
            ->where('user_id', auth()->id())
            ->latest()
            ->get();

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
            'user_id'     => auth()->id(),
            'total_price' => $total,
            'notes'       => $request->notes,
        ]);

        $order->items()->createMany($items);

        return redirect()->route('orders.index');
    }

    public function show(Order $order)
    {
        $order->load(['user', 'items.product', 'approval.approver']);

        return Inertia::render('orders/show', ['order' => $order]);
    }

    public function destroy(Order $order)
    {
        abort_if($order->user_id !== auth()->id(), 403);
        abort_if($order->approval !== null, 403, 'Cannot delete a processed order.');

        $order->items()->delete();
        $order->delete();

        return redirect()->route('orders.index');
    }
}
