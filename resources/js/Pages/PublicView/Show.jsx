import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { ShoppingCart, Plus, Minus, ArrowLeft } from 'lucide-react';
import Layout from '@/Layouts/Layout';
import { Button } from '@/components/ui/button';
import { useCart } from '@/hooks/useCart';
import { currency } from '@/data/fragrances';

export default function Show({ product }) {
    const { cartCount, addToCart } = useCart();
    const [qty, setQty] = useState(1);

    if (!product) {
        return (
            <Layout>
                <Head title="Product not found" />
                <div className="mx-auto max-w-3xl px-4 py-20 text-center">
                    <h1 className="text-2xl font-bold text-gray-900">Product not found</h1>
                    <p className="mt-2 text-gray-500">The product you are looking for does not exist.</p>
                    <Link href="/" className="mt-6 inline-flex items-center gap-2 text-rose-600 hover:underline">
                        <ArrowLeft className="size-4" />
                        Back to browsing
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <Head title={product.name} />

            <div className="border-b border-gray-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                        <ArrowLeft className="size-4" />
                        Back to Fragrances
                    </Link>

                    <Button variant="outline" size="icon" className="relative" asChild>
                        <Link href="/cart" aria-label="View cart">
                            <ShoppingCart className="size-5" />
                            {cartCount > 0 && (
                                <span className="absolute -right-2.5 -top-2.5 flex size-5 items-center justify-center rounded-full bg-rose-600 text-[11px] font-semibold text-white">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </Button>
                </div>
            </div>

            <div className="mx-auto max-w-6xl px-4 py-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
                    <div className="flex h-72 items-center justify-center overflow-hidden rounded-2xl bg-gray-100 lg:h-[28rem]">
                        {product.image ? (
                            <img src={`/storage/${product.image}`} alt={product.name} className="h-full w-full object-cover" />
                        ) : (
                            <span className="text-6xl text-gray-300">?</span>
                        )}
                    </div>

                    <div className="flex flex-col">
                        <p className="text-sm font-medium uppercase tracking-wide text-rose-600">{product.category}</p>
                        <h1 className="mt-1 text-3xl font-bold text-gray-900">{product.name}</h1>

                        <div className="mt-4">
                            <span className={`rounded-full px-3 py-1 text-sm font-medium ${
                                product.quantity > 0
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-red-100 text-red-700'
                            }`}>
                                {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
                            </span>
                        </div>

                        <p className="mt-6 text-sm text-gray-500">Sold by: {product.user?.name ?? 'Store'}</p>

                        <div className="mt-6 text-3xl font-bold text-gray-900">{currency(product.price)}</div>

                        <div className="mt-4 flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => setQty((q) => Math.max(1, q - 1))}
                                    aria-label="Decrease quantity"
                                    className="flex size-9 items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50"
                                >
                                    <Minus className="size-4" />
                                </button>
                                <span className="w-8 text-center font-medium">{qty}</span>
                                <button
                                    type="button"
                                    onClick={() => setQty((q) => Math.min(product.quantity, q + 1))}
                                    disabled={qty >= product.quantity}
                                    aria-label="Increase quantity"
                                    className="flex size-9 items-center justify-center rounded-md border border-gray-200 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    <Plus className="size-4" />
                                </button>
                            </div>

                            <Button
                                size="lg"
                                className="flex-1"
                                disabled={product.quantity < 1}
                                onClick={() => {
                                    addToCart(product, qty);
                                    router.visit('/cart');
                                }}
                            >
                                <ShoppingCart className="size-5" />
                                {product.quantity < 1 ? 'Out of Stock' : 'Add to Cart'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
