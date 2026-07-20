import React from 'react';
import { Head, Link } from '@inertiajs/react';
import { ArrowLeft, Package, Truck, CheckCircle, Clock } from 'lucide-react';
import Layout from '@/Layouts/Layout';
import { currency } from '@/data/fragrances';

const STEPS = [
    { key: 'preparing', label: 'Preparing your package', icon: Package },
    { key: 'shipped', label: 'Shipped out', icon: Truck },
    { key: 'in_transit', label: 'In transit', icon: Truck },
    { key: 'delivered', label: 'Delivered', icon: CheckCircle },
];

const STATUS_INDEX = { preparing: 0, shipped: 1, in_transit: 2, delivered: 3 };

export default function OrderTracking({ order }) {
    const currentIdx = STATUS_INDEX[order.status] ?? 0;

    return (
        <Layout>
            <Head title={`Order #${order.id}`} />

            <div className="border-b border-gray-200 bg-white">
                <div className="mx-auto flex max-w-3xl items-center gap-4 px-4 py-4">
                    <Link
                        href="/orders"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                        <ArrowLeft className="size-4" />
                        My Orders
                    </Link>
                    <h1 className="text-lg font-semibold text-gray-900">
                        Order #{order.id}
                    </h1>
                    <span className="ml-auto rounded-full bg-rose-100 px-3 py-1 text-xs font-medium text-rose-700 capitalize">
                        {order.status.replace('_', ' ')}
                    </span>
                </div>
            </div>

            <div className="mx-auto max-w-3xl px-4 py-8">
                {/* Tracking Timeline */}
                <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900">Tracking</h2>
                    <div className="mt-6 space-y-0">
                        {STEPS.map((step, i) => {
                            const Icon = step.icon;
                            const done = i <= currentIdx;
                            const isLast = STATUS_INDEX[order.status] === 3;

                            return (
                                <div key={step.key} className="relative flex gap-4 pb-8 last:pb-0">
                                    {/* Line */}
                                    {i < STEPS.length - 1 && (
                                        <div
                                            className={`absolute left-[15px] top-8 h-full w-0.5 ${
                                                done && !isLast ? 'bg-rose-600' : 'bg-gray-200'
                                            }`}
                                        />
                                    )}

                                    {/* Icon */}
                                    <div
                                        className={`relative flex size-8 shrink-0 items-center justify-center rounded-full ${
                                            done
                                                ? 'bg-rose-600 text-white'
                                                : 'bg-gray-100 text-gray-400'
                                        }`}
                                    >
                                        {step.key === 'in_transit' && order.status === 'in_transit' ? (
                                            <Truck className="size-4 animate-pulse" />
                                        ) : (
                                            <Icon className="size-4" />
                                        )}
                                    </div>

                                    {/* Content */}
                                    <div className="pt-1">
                                        <p
                                            className={`text-sm font-medium ${
                                                done ? 'text-gray-900' : 'text-gray-400'
                                            }`}
                                        >
                                            {step.label}
                                        </p>
                                        {done && step.key === order.status && (
                                            <div className="mt-1 flex items-center gap-1 text-xs text-gray-500">
                                                <Clock className="size-3" />
                                                <span>
                                                    {new Date(order.updated_at).toLocaleString('en-PH', {
                                                        month: 'short',
                                                        day: 'numeric',
                                                        hour: '2-digit',
                                                        minute: '2-digit',
                                                    })}
                                                </span>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Shipping Info */}
                <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900">Shipping Address</h2>
                    <div className="mt-3 text-sm text-gray-600">
                        <p className="font-medium text-gray-900">{order.shipping_address.full_name}</p>
                        <p>{order.shipping_address.address}</p>
                        <p>
                            {order.shipping_address.city}, {order.shipping_address.zip}
                        </p>
                        <p>{order.shipping_address.phone}</p>
                    </div>
                </div>

                {/* Payment */}
                <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900">Payment</h2>
                    <p className="mt-2 text-sm text-gray-600 capitalize">
                        {order.payment_method.replace('_', ' ')}
                    </p>
                </div>

                {/* Items */}
                <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                    <h2 className="text-lg font-semibold text-gray-900">Items</h2>
                    <ul className="mt-4 divide-y divide-gray-100">
                        {order.items.map((item, i) => (
                            <li key={i} className="flex items-center justify-between py-3">
                                <div>
                                    <p className="text-sm font-medium text-gray-900">
                                        Product #{item.id}
                                    </p>
                                    <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                                </div>
                                <span className="text-sm font-medium text-gray-900">
                                    {currency(item.price * item.qty)}
                                </span>
                            </li>
                        ))}
                    </ul>
                    <div className="mt-4 flex justify-between border-t border-gray-100 pt-4 text-base font-semibold text-gray-900">
                        <span>Total</span>
                        <span>{currency(order.total)}</span>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
