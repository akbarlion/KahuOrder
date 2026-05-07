<?php

namespace App\Http\Controllers;

use App\Models\Approval;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ApprovalController extends Controller
{
    public function index()
    {
        $orders = Order::with(['items.product', 'approval'])
            ->whereDoesntHave('approval')
            ->latest()
            ->get();

        return Inertia::render('approvals/index', ['orders' => $orders]);
    }

    public function approve(Order $order)
    {
        abort_if($order->approval !== null, 409, 'Order already processed.');

        Approval::create([
            'order_id'    => $order->id,
            'approved_by' => auth()->id(),
            'status'      => 'approved',
            'approved_at' => now(),
        ]);

        return redirect()->route('approvals.index');
    }

    public function reject(Request $request, Order $order)
    {
        abort_if($order->approval !== null, 409, 'Order already processed.');

        $request->validate(['note' => 'required|string']);

        Approval::create([
            'order_id'    => $order->id,
            'approved_by' => auth()->id(),
            'status'      => 'rejected',
            'note'        => $request->note,
            'approved_at' => now(),
        ]);

        return redirect()->route('approvals.index');
    }
}
