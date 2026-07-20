import React from 'react';
import { Head, router } from '@inertiajs/react';
import { Package } from 'lucide-react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { currency } from '@/data/fragrances';

const STATUS_FLOW = ['preparing', 'shipped', 'in_transit', 'delivered'];
const STATUS_COLORS = {
    preparing: 'bg-yellow-100 text-yellow-700',
    shipped: 'bg-blue-100 text-blue-700',
    in_transit: 'bg-blue-100 text-blue-700',
    delivered: 'bg-green-100 text-green-700',
};

export default function AdminOrders({ orders }) {
    function advanceStatus(orderId, currentStatus) {
        const idx = STATUS_FLOW.indexOf(currentStatus);
        if (idx >= STATUS_FLOW.length - 1) return;

        const nextStatus = STATUS_FLOW[idx + 1];

        router.put(`/admin/orders/${orderId}`, { status: nextStatus }, {
            preserveScroll: true,
        });
    }

    return (
        <AdminLayout>
            <Head title="Orders" />
            <div className="p-6">
                <h1 className="mb-6 text-2xl font-bold text-gray-900">Orders</h1>

                {orders.length === 0 ? (
                    <div className="rounded-lg bg-white p-12 text-center shadow-sm">
                        <Package className="mx-auto size-12 text-gray-300" />
                        <p className="mt-4 text-lg font-medium text-gray-900">No orders yet</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-lg bg-white shadow-sm">
                        <table className="w-full text-left text-sm">
                            <thead className="border-b bg-gray-50 text-xs uppercase text-gray-500">
                                <tr>
                                    <th className="px-4 py-3">Order #</th>
                                    <th className="px-4 py-3">Customer</th>
                                    <th className="px-4 py-3">Items</th>
                                    <th className="px-4 py-3">Total</th>
                                    <th className="px-4 py-3">Payment</th>
                                    <th className="px-4 py-3">Status</th>
                                    <th className="px-4 py-3">Date</th>
                                    <th className="px-4 py-3">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {orders.map((order) => (
                                    <tr key={order.id} className="hover:bg-gray-50">
                                        <td className="px-4 py-3 font-medium">#{order.id}</td>
                                        <td className="px-4 py-3">{order.user.name}</td>
                                        <td className="px-4 py-3">{order.items.length}</td>
                                        <td className="px-4 py-3 font-medium">{currency(order.total)}</td>
                                        <td className="px-4 py-3 capitalize">{order.payment_method.replace('_', ' ')}</td>
                                        <td className="px-4 py-3">
                                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[order.status]}`}>
                                                {order.status.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">
                                            {new Date(order.created_at).toLocaleDateString('en-PH', {
                                                month: 'short', day: 'numeric', year: 'numeric',
                                            })}
                                        </td>
                                        <td className="px-4 py-3">
                                            {order.status !== 'delivered' ? (
                                                <button
                                                    onClick={() => advanceStatus(order.id, order.status)}
                                                    className="rounded-md bg-rose-600 px-3 py-1 text-xs font-medium text-white hover:bg-rose-700"
                                                >
                                                    Advance to {STATUS_FLOW[STATUS_FLOW.indexOf(order.status) + 1]?.replace('_', ' ')}
                                                </button>
                                            ) : (
                                                <span className="text-xs text-gray-400">Completed</span>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </AdminLayout>
    );
}
