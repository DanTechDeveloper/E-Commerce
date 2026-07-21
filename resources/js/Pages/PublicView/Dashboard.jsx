import React, { useMemo, useState } from 'react';
import { Head, Link, usePage } from '@inertiajs/react';
import { ShoppingCart, Plus, Search } from 'lucide-react';
import Layout from '@/Layouts/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCart } from '@/hooks/useCart';
import { currency } from '@/data/fragrances';

export default function Dashboard({ products }) {
    const { cartCount, addToCart } = useCart();
    const [query, setQuery] = useState('');
    const [category, setCategory] = useState('All');

    const categories = useMemo(() => {
        const cats = [...new Set(products.map((p) => p.category))];
        return ['All', ...cats];
    }, [products]);

    const filtered = useMemo(() => {
        const q = query.trim().toLowerCase();
        return products.filter((p) => {
            const matchesCategory = category === 'All' || p.category === category;
            const matchesQuery = !q || p.name.toLowerCase().includes(q) || p.category.toLowerCase().includes(q);
            return matchesCategory && matchesQuery;
        });
    }, [query, category, products]);

    return (
        <Layout>
            <Head title="Fragrances" />

            <div className="border-b border-gray-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
                    <div>
                        <h1 className="text-xl font-bold text-gray-900">Discover Fragrances</h1>
                        <p className="text-sm text-gray-500">Curated scents for every mood</p>
                    </div>

                    <div className="flex items-center gap-3">
                        {usePage().props.auth?.user && (
                            <Button variant="outline" size="sm" asChild>
                                <Link href="/orders">My Purchases</Link>
                            </Button>
                        )}
                        <div className="relative hidden sm:block">
                            <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                            <Input
                                type="search"
                                placeholder="Search fragrances..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                className="w-64 pl-9"
                            />
                        </div>

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
            </div>

            <div className="mx-auto max-w-7xl px-4 py-8">
                <div className="relative mb-6 sm:hidden">
                    <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400" />
                    <Input
                        type="search"
                        placeholder="Search fragrances..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        className="w-full pl-9"
                    />
                </div>

                <div className="mb-6 flex flex-wrap gap-2 border-b border-gray-200 pb-px">
                    {categories.map((cat) => {
                        const active = category === cat;
                        return (
                            <button
                                key={cat}
                                type="button"
                                onClick={() => setCategory(cat)}
                                className={`rounded-t-md px-4 py-2 text-sm font-medium transition ${
                                    active
                                        ? 'border-b-2 border-rose-600 text-rose-600'
                                        : 'border-b-2 border-transparent text-gray-500 hover:text-gray-800'
                                }`}
                            >
                                {cat}
                            </button>
                        );
                    })}
                </div>

                {filtered.length === 0 ? (
                    <div className="rounded-lg bg-white p-12 text-center text-gray-500 shadow-sm">
                        No products match your search.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filtered.map((product) => (
                            <div
                                key={product.id}
                                className="group flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
                            >
                                <Link href={`/fragrances/${product.id}`} className="relative block">
                                    <div className="flex h-44 items-center justify-center bg-gray-100">
                                        {product.image ? (
                                            <img
                                                src={`/storage/${product.image}`}
                                                alt={product.name}
                                                className="h-full w-full object-cover"
                                            />
                                        ) : (
                                            <span className="text-4xl text-gray-300">?</span>
                                        )}

                                        <button
                                            type="button"
                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                addToCart(product);
                                            }}
                                            aria-label={`Add ${product.name} to cart`}
                                            className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-white/90 text-gray-800 shadow-sm transition hover:scale-105 hover:bg-white"
                                        >
                                            <Plus className="size-5" />
                                        </button>
                                    </div>
                                </Link>

                                <div className="flex flex-1 flex-col p-4">
                                    <Link href={`/fragrances/${product.id}`} className="flex items-start justify-between gap-2">
                                        <h3 className="font-semibold text-gray-900 hover:underline">{product.name}</h3>
                                    </Link>
                                    <p className="mt-1 text-sm text-gray-500">{product.category}</p>

                                    <div className="mt-2">
                                        <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                            product.quantity > 0
                                                ? 'bg-green-100 text-green-700'
                                                : 'bg-red-100 text-red-700'
                                        }`}>
                                            {product.quantity > 0 ? `${product.quantity} in stock` : 'Out of stock'}
                                        </span>
                                    </div>

                                    <div className="mt-4 flex items-center justify-between">
                                        <span className="text-lg font-bold text-gray-900">{currency(product.price)}</span>
                                        <Button size="sm" onClick={() => addToCart(product)} disabled={product.quantity < 1}>
                                            <ShoppingCart className="size-4" />
                                            Add
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
