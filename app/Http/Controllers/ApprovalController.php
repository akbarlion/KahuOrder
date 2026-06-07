<?php

namespace App\Http\Controllers;

use App\Models\Approval;
use App\Models\Order;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Inertia\Response;

class ApprovalController extends Controller
{
    public function index(): Response
    {
        $orders = Order::with(['items.product', 'approval'])
            ->whereDoesntHave('approval')
            ->latest()
            ->get();

        return Inertia::render('approvals/index', ['orders' => $orders]);
    }

    public function approve(Order $order): RedirectResponse
    {
        DB::transaction(function () use ($order) {
            $lockedOrder = Order::whereKey($order->id)->lockForUpdate()->firstOrFail();

            abort_if($lockedOrder->approval()->exists(), 409, 'Order already processed.');

            Approval::create([
                'order_id' => $lockedOrder->id,
                'approved_by' => auth()->id(),
                'status' => 'approved',
                'approved_at' => now(),
            ]);
        });

        return redirect()->route('approvals.index');
    }

    public function reject(Request $request, Order $order): RedirectResponse
    {
        $request->validate(['note' => 'required|string']);

        DB::transaction(function () use ($request, $order) {
            $lockedOrder = Order::whereKey($order->id)
                ->with('items.product')
                ->lockForUpdate()
                ->firstOrFail();

            abort_if($lockedOrder->approval()->exists(), 409, 'Order already processed.');

            Approval::create([
                'order_id' => $lockedOrder->id,
                'approved_by' => auth()->id(),
                'status' => 'rejected',
                'note' => $request->note,
                'approved_at' => now(),
            ]);

            foreach ($lockedOrder->items as $item) {
                $item->product?->increment('stock', $item->qty);
            }
        });

        return redirect()->route('approvals.index');
    }
}
