import React, { useState } from "react";
import { Head, Link } from "@inertiajs/react";
import { Package, ArrowLeft } from "lucide-react";
import Layout from "@/Layouts/Layout";
import { currency } from "@/data/fragrances";

const STATUS_LABELS = {
    pending: "Pending",
    preparing: "To Pay",
    shipped: "Shipped",
    in_transit: "In Transit",
    delivered: "Delivered",
    cancelled: "Cancelled",
};

const STATUS_COLORS = {
    pending: "bg-orange-100 text-orange-700",
    preparing: "bg-yellow-100 text-yellow-700",
    shipped: "bg-blue-100 text-blue-700",
    in_transit: "bg-blue-100 text-blue-700",
    delivered: "bg-green-100 text-green-700",
    cancelled: "bg-red-100 text-red-700",
};

const TABS = [
    { label: "All", filter: () => true },
    { label: "To Pay", filter: (s) => s === "pending" },
    { label: "To Ship", filter: (s) => s === "preparing" },
    {
        label: "To Receive",
        filter: (s) => ["shipped", "in_transit"].includes(s),
    },
    { label: "Completed", filter: (s) => s === "delivered" },
    { label: "Cancelled", filter: (s) => s === "cancelled" },
];

export default function Orders({ orders }) {
    const [tab, setTab] = useState(0);
    const filtered = orders.filter(TABS[tab].filter);

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
                    <h1 className="text-lg font-semibold text-gray-900">
                        Purchases
                    </h1>
                </div>
            </div>

            <div className="mx-auto max-w-3xl px-4 py-8">
                <div className="mb-6 flex gap-1 overflow-x-auto rounded-lg bg-gray-100 p-1">
                    {TABS.map((t, i) => (
                        <button
                            key={t.label}
                            onClick={() => setTab(i)}
                            className={`whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition ${
                                i === tab
                                    ? "bg-white text-gray-900 shadow-sm"
                                    : "text-gray-500 hover:text-gray-700"
                            }`}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {filtered.length === 0 ? (
                    <div className="rounded-xl bg-white p-12 text-center shadow-sm">
                        <Package className="mx-auto size-12 text-gray-300" />
                        <p className="mt-4 text-lg font-medium text-gray-900">
                            No orders yet
                        </p>
                        <p className="mt-1 text-gray-500">
                            Start shopping to see your orders here.
                        </p>
                        <Link href="/" className="mt-6 inline-block">
                            <button className="rounded-md bg-primary px-6 py-2 text-sm font-medium text-white hover:bg-primary/90">
                                Browse Fragrances
                            </button>
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {filtered.map((order) => {
                            const clickable = order.status !== "preparing";

                            const card = (
                                <>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-900">
                                                Order #{order.id}
                                            </p>
                                            <p className="mt-1 text-xs text-gray-500">
                                                {new Date(
                                                    order.created_at,
                                                ).toLocaleDateString("en-PH", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </p>
                                        </div>
                                        <span
                                            className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${STATUS_COLORS[order.status] || "bg-gray-100 text-gray-700"}`}
                                        >
                                            {STATUS_LABELS[order.status] ||
                                                order.status.replace("_", " ")}
                                        </span>
                                    </div>
                                    <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                                        <span className="text-xs text-gray-500">
                                            {order.items.length} item
                                            {order.items.length > 1 ? "s" : ""}
                                        </span>
                                        <span className="text-sm font-semibold text-gray-900">
                                            {currency(order.total)}
                                        </span>
                                    </div>
                                    {!clickable && (
                                        <div className="mt-3 flex justify-end">
                                            <button
                                                onClick={() => {
                                                    if (
                                                        confirm(
                                                            "Cancel this order?",
                                                        )
                                                    ) {
                                                        fetch(
                                                            `/orders/${order.id}/cancel`,
                                                            {
                                                                method: "POST",
                                                                headers: {
                                                                    "X-CSRF-TOKEN":
                                                                        document.querySelector(
                                                                            'meta[name="csrf-token"]',
                                                                        )
                                                                            ?.content,
                                                                    "Content-Type":
                                                                        "application/json",
                                                                },
                                                            },
                                                        ).then(() =>
                                                            window.location.reload(),
                                                        );
                                                    }
                                                }}
                                                className="rounded-md bg-red-50 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-100"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    )}
                                </>
                            );

                            return clickable ? (
                                <Link
                                    key={order.id}
                                    href={`/orders/${order.id}`}
                                    className="block rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md"
                                >
                                    {card}
                                </Link>
                            ) : (
                                <div
                                    key={order.id}
                                    className="block rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
                                >
                                    {card}
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </Layout>
    );
}
