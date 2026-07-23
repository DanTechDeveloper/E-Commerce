<?php

namespace App\Http\Controllers;

use App\Models\CartItem;
use App\Models\Order;
use Illuminate\Http\Request;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        return Inertia::render('PublicView/Orders', [
            'orders' => auth()->user()->orders()->latest()->get(),
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'full_name' => 'required|string',
            'address' => 'required|string',
            'city' => 'required|string',
            'zip' => 'required|string',
            'phone' => 'required|string',
            'payment_method' => 'required|in:cod,gcash',
            'items' => 'required|array|min:1',
            'items.*.id' => 'required|integer|exists:products,id',
            'items.*.qty' => 'required|integer|min:1',
            'items.*.price' => 'required|numeric',
            'total' => 'required|numeric|min:0',
        ]);

        $order = auth()->user()->orders()->create([
            'items' => $data['items'],
            'total' => $data['total'],
            'shipping_address' => [
                'full_name' => $data['full_name'],
                'address' => $data['address'],
                'city' => $data['city'],
                'zip' => $data['zip'],
                'phone' => $data['phone'],
            ],
            'payment_method' => $data['payment_method'],
            'status' => 'preparing',
        ]);

        CartItem::where('user_id', auth()->id())->delete();

        return redirect('/orders')->with('flash', ['success' => 'Order placed!']);
    }

    public function show($id)
    {
        $order = auth()->user()->orders()->findOrFail($id);
        return Inertia::render('PublicView/OrderTracking', [
            'order' => $order,
        ]);
    }

    public function cancel(Order $order)
    {
        if ($order->user_id !== auth()->id() || $order->status !== 'preparing') {
            return back()->withErrors(['order' => 'Order cannot be cancelled.']);
        }

        $order->update(['status' => 'cancelled']);

        return redirect('/orders')->with('flash', ['success' => 'Order cancelled.']);
    }
}
