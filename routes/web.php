<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\PublicView;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\Admin\AdminController;
use App\Http\Controllers\CartController;
use App\Http\Controllers\OrderController;

Route::get('/', [PublicView::class, 'index']);
Route::get('/cart', [PublicView::class, 'cart']);
Route::get('/fragrances/{id}', [PublicView::class, 'show'])->whereNumber('id');

Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'create'])->name('login');
    Route::post('/login', [AuthController::class, 'store']);
    Route::get('/register', [AuthController::class, 'createRegister'])->name('register');
    Route::post('/register', [AuthController::class, 'storeRegister']);
});

Route::middleware('auth')->group(function () {
    Route::get('/admin', [AdminController::class, 'index'])->name('admin');
    Route::get('/admin/products', [AdminController::class, 'products'])->name('admin.products');
    Route::post('/admin/products', [AdminController::class, 'storeProduct']);
    Route::put('/admin/products/{product}', [AdminController::class, 'updateProduct']);
    Route::delete('/admin/products/{product}', [AdminController::class, 'destroyProduct']);
    Route::get('/admin/orders', [AdminController::class, 'orders']);
    Route::put('/admin/orders/{order}', [AdminController::class, 'updateOrder']);

    Route::get('/cart/items', [CartController::class, 'index']);
    Route::post('/cart/sync', [CartController::class, 'sync']);
    Route::post('/cart/remove', [CartController::class, 'destroy']);
    Route::post('/cart/clear', [CartController::class, 'clear']);

    Route::post('/orders', [OrderController::class, 'store']);
    Route::get('/orders', [OrderController::class, 'index']);
    Route::get('/orders/{id}', [OrderController::class, 'show']);
    Route::post('/orders/{order}/cancel', [OrderController::class, 'cancel']);
    Route::get('/checkout', [PublicView::class, 'checkout']);

});

Route::post('/logout', [AuthController::class, 'destroy'])->middleware('auth')->name('logout');
