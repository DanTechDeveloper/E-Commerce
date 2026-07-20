import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { Package, ArrowLeft } from 'lucide-react';
import Layout from '@/Layouts/Layout';
import { currency } from '@/data/fragrances';

const STATUS_COLORS = {
    preparing: 'bg-yellow-100 text-yellow-700',
    shipped: 'bg-blue-100 text-blue-700',
    in_transit: 'bg-blue-100 text-blue-700',
    delivered: 'bg-green-100 text-green-700',
};

export default function Orders({ orders }) {
    return (
        <Layout>
            <Head title="My Orders" />

            <div className="border-b border-gray-200 bg-white">
                <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-4">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                        <ArrowLeft className="size-4" />
                        Home
                    </Link>
                    <h1 className="text-lg font-semibold text-gray-900">My Orders</h1>
                </div>
            </div>

            <div className="mx-auto max-w-3xl px-4 py-8">
                {orders.length === 0 ? (
                    <div className="rounded-xl bg-white p-12 text-center shadow-sm">
                        <Package className="mx-auto size-12 text-gray-300" />
                        <p className="mt-4 text-lg font-medium text-gray-900">No orders yet</p>
                        <p className="mt-1 text-gray-500">Start shopping to see your orders here.</p>
                        <Link href="/" className="mt-6 inline-block">
                            <button className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/90">
                                Browse Fragrances
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {orders.map((order) => (
                            <Link
                                key={order.id}
                                href={`/orders/${order.id}`}
                                className="block rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-900">
                                            Order #{order.id}
                                        </p>
                                        <p className="mt-1 text-xs text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString('en-PH', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            })}
                                        </p>
                                    </div>
                                    <span
                                        className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${STATUS_COLORS[order.status] || 'bg-gray-100 text-gray-700'}`}
                                    >
                                        {order.status.replace('_', ' ')}
                                    </span>
                                </div>
                                <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                                    <span className="text-xs text-gray-500">
                                        {order.items.length} item{order.items.length > 1 ? 's' : ''}
                                    </span>
                                    <span className="text-sm font-semibold text-gray-900">
                                        {currency(order.total)}
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </Layout>
    );
}
