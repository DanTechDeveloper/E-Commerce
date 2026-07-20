import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ShoppingCart, Plus, Minus, Trash2, ArrowLeft, LogIn, X } from 'lucide-react';
import Layout from '@/Layouts/Layout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { currency } from '@/data/fragrances';

export default function Cart() {
    const { cart, cartCount, cartTotal, updateQty, removeItem, clearCart } =
        useCart();
    const { auth } = usePage().props;
    const isGuest = !auth?.user;
    const [showLoginNotice, setShowLoginNotice] = useState(false);

    function handleCheckout() {
        if (isGuest) {
            setShowLoginNotice(true);
            return;
        }
        router.visit('/checkout');
    }

    return (
        <Layout>
            <Head title="Your Cart" />

            {/* Top bar */}
            <div className="border-b border-gray-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                        <ArrowLeft className="size-4" />
                        Continue Shopping
                    </Link>

                    <h1 className="flex items-center gap-2 text-lg font-semibold text-gray-900">
                        <ShoppingCart className="size-5" />
                        Your Cart
                        {cartCount > 0 && (
                            <span className="rounded-full bg-rose-600 px-2 py-0.5 text-xs font-semibold text-white">
                                {cartCount}
                            </span>
                        )}
                    </h1>
                </div>
            </div>

            <div className="mx-auto max-w-5xl px-4 py-8">
                {cart.length === 0 ? (
                    <div className="rounded-xl bg-white p-12 text-center shadow-sm">
                        <ShoppingCart className="mx-auto size-12 text-gray-300" />
                        <p className="mt-4 text-lg font-medium text-gray-900">
                            Your cart is empty
                        </p>
                        <p className="mt-1 text-gray-500">
                            Browse our fragrances and add your favorites.
                        </p>
                        <Link href="/" className="mt-6 inline-block">
                            <Button size="lg">Browse Fragrances</Button>
                        </Link>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                        {/* Items */}
                        <div className="lg:col-span-2">
                            <ul className="space-y-4">
                                {cart.map((item) => (
                                    <li
                                        key={item.id}
                                        className="flex gap-4 rounded-xl border border-gray-200 bg-white p-4 shadow-sm"
                                    >
                                        <Link
                                            href={`/fragrances/${item.id}`}
                                            className="flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-gray-100"
                                        >
                                            {item.image ? (
                                                <img src={`/storage/${item.image}`} alt={item.name} className="h-full w-full object-cover" />
                                            ) : (
                                                <span className="text-gray-300">?</span>
                                            )}
                                        </Link>
                                        <div className="flex flex-1 flex-col">
                                            <div className="flex items-start justify-between gap-2">
                                                <div>
                                                    <Link
                                                        href={`/fragrances/${item.id}`}
                                                        className="font-semibold text-gray-900 hover:underline"
                                                    >
                                                        {item.name}
                                                    </Link>
                                                    <p className="text-sm text-gray-500">
                                                        {item.category}
                                                    </p>
                                                    <p className="mt-0.5 text-xs text-gray-400">
                                                        {item.quantity - item.qty > 0
                                                            ? `${item.quantity - item.qty} remaining`
                                                            : 'No more stock available'}
                                                    </p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeItem(item.id)
                                                    }
                                                    aria-label="Remove item"
                                                    className="text-gray-400 hover:text-rose-600"
                                                >
                                                    <Trash2 className="size-5" />
                                                </button>
                                            </div>

                                            <div className="mt-auto flex items-center justify-between pt-3">
                                                <div className="flex items-center gap-2">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateQty(
                                                                item.id,
                                                                -1
                                                            )
                                                        }
                                                        disabled={item.qty <= 1}
                                                        aria-label="Decrease quantity"
                                                        className="flex size-8 items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        <Minus className="size-4" />
                                                    </button>
                                                    <span className="w-8 text-center font-medium">
                                                        {item.qty}
                                                    </span>
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            updateQty(item.id, 1)
                                                        }
                                                        disabled={item.qty >= item.quantity}
                                                        aria-label="Increase quantity"
                                                        className="flex size-8 items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                                    >
                                                        <Plus className="size-4" />
                                                    </button>
                                                </div>
                                                <span className="font-semibold text-gray-900">
                                                    {currency(
                                                        item.price * item.qty
                                                    )}
                                                </span>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>

                            <button
                                type="button"
                                onClick={clearCart}
                                className="mt-4 text-sm text-gray-500 hover:text-rose-600"
                            >
                                Clear cart
                            </button>
                        </div>

                        {/* Summary */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Order Summary
                                </h2>
                                <dl className="mt-4 space-y-2 text-sm">
                                    <div className="flex justify-between">
                                        <dt className="text-gray-500">
                                            Subtotal ({cartCount} items)
                                        </dt>
                                        <dd className="font-medium text-gray-900">
                                            {currency(cartTotal)}
                                        </dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-gray-500">
                                            Shipping
                                        </dt>
                                        <dd className="font-medium text-emerald-600">
                                            Free
                                        </dd>
                                    </div>
                                </dl>
                                <div className="mt-4 flex justify-between border-t border-gray-100 pt-4 text-base font-semibold text-gray-900">
                                    <span>Total</span>
                                    <span>{currency(cartTotal)}</span>
                                </div>
                                <Button
                                    className="mt-6 w-full"
                                    size="lg"
                                    onClick={handleCheckout}
                                >
                                    Checkout
                                </Button>
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Login reminder modal */}
            {showLoginNotice && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div
                        className="absolute inset-0 bg-black/40"
                        onClick={() => setShowLoginNotice(false)}
                    />
                    <div className="relative w-full max-w-sm rounded-xl bg-white p-6 text-center shadow-xl">
                        <button
                            type="button"
                            onClick={() => setShowLoginNotice(false)}
                            aria-label="Close"
                            className="absolute right-4 top-4 text-gray-400 hover:text-gray-600"
                        >
                            <X className="size-5" />
                        </button>

                        <div className="mx-auto flex size-12 items-center justify-center rounded-full bg-rose-100 text-rose-600">
                            <LogIn className="size-6" />
                        </div>
                        <h2 className="mt-4 text-lg font-semibold text-gray-900">
                            Login Required
                        </h2>
                        <p className="mt-2 text-sm text-gray-500">
                            You need to sign in to your account before you can
                            proceed to checkout.
                        </p>

                        <div className="mt-6 flex flex-col gap-2">
                            <Button
                                size="lg"
                                onClick={() => router.visit('/login?redirect=/checkout')}
                            >
                                <LogIn className="size-4" />
                                Proceed to Login
                            </Button>
                            <Button
                                variant="ghost"
                                onClick={() => setShowLoginNotice(false)}
                            >
                                Cancel
                            </Button>
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    );
}
