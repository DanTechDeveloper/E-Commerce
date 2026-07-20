<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\CartItem;

class CartController extends Controller
{
    public function index()
    {
        $items = CartItem::where('user_id', auth()->id())
            ->with('product')
            ->get()
            ->map(fn ($item) => [
                'id' => $item->product_id,
                'name' => $item->product->name,
                'price' => $item->product->price,
                'image' => $item->product->image,
                'category' => $item->product->category,
                'quantity' => $item->product->quantity,
                'qty' => $item->quantity,
            ]);

        return response()->json($items);
    }

    public function sync(Request $request)
    {
        $items = $request->validate([
            'items' => 'required|array',
            'items.*.id' => 'required|exists:products,id',
            'items.*.qty' => 'required|integer|min:1',
        ]);

        $user = auth()->user();

        CartItem::where('user_id', $user->id)->delete();

        foreach ($items['items'] as $item) {
            CartItem::create([
                'user_id' => $user->id,
                'product_id' => $item['id'],
                'quantity' => $item['qty'],
            ]);
        }

        return response()->json(['message' => 'Cart synced']);
    }

    public function destroy(Request $request)
    {
        $request->validate(['id' => 'required|exists:products,id']);

        CartItem::where('user_id', auth()->id())
            ->where('product_id', $request->id)
            ->delete();

        return response()->json(['message' => 'Item removed']);
    }

    public function clear()
    {
        CartItem::where('user_id', auth()->id())->delete();
        return response()->json(['message' => 'Cart cleared']);
    }
}
