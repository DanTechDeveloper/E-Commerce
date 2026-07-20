<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;

class PublicView extends Controller
{
    public function index() {
        return Inertia::render('PublicView/Dashboard', [
            'products' => Product::with('user')->latest()->get(),
        ]);
    }

    public function show($id) {
        return Inertia::render('PublicView/Show', [
            'product' => Product::findOrFail($id),
        ]);
    }

    public function cart() {
        return Inertia::render('PublicView/Cart');
    }

    public function checkout() {
        return Inertia::render('PublicView/Checkout');
    }
}
