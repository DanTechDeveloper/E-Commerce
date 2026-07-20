import React, { useState } from 'react';
import { Head, Link, router, usePage } from '@inertiajs/react';
import { ShoppingCart, ArrowLeft, CreditCard, Banknote, Loader2 } from 'lucide-react';
import Layout from '@/Layouts/Layout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCart } from '@/hooks/useCart';
import { currency } from '@/data/fragrances';

const PAYMENT_METHODS = [
    { id: 'cod', label: 'Cash on Delivery', icon: Banknote },
    { id: 'gcash', label: 'GCash', icon: CreditCard },
];

export default function Checkout() {
    const { cart, cartCount, cartTotal, clearCart } = useCart();
    const { auth } = usePage().props;
    const [submitting, setSubmitting] = useState(false);

    const [form, setForm] = useState({
        full_name: auth?.user?.name || '',
        address: '',
        city: '',
        zip: '',
        phone: '',
        payment_method: 'cod',
    });

    const [errors, setErrors] = useState({});

    function update(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
        setErrors((prev) => ({ ...prev, [field]: '' }));
    }

    function validate() {
        const errs = {};
        if (!form.full_name.trim()) errs.full_name = 'Full name is required';
        if (!form.address.trim()) errs.address = 'Address is required';
        if (!form.city.trim()) errs.city = 'City is required';
        if (!form.zip.trim()) errs.zip = 'ZIP code is required';
        if (!form.phone.trim()) errs.phone = 'Phone number is required';
        setErrors(errs);
        return Object.keys(errs).length === 0;
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!validate()) return;

        setSubmitting(true);

        router.post('/orders', {
            ...form,
            items: cart.map((item) => ({ id: item.id, qty: item.qty, price: item.price })),
            total: cartTotal,
        }, {
            onSuccess: () => {
                clearCart();
                router.visit('/orders');
            },
            onError: (errs) => {
                setErrors(errs);
                setSubmitting(false);
            },
            onFinish: () => setSubmitting(false),
        });
    }

    if (cart.length === 0) {
        return (
            <Layout>
                <Head title="Checkout" />
                <div className="mx-auto max-w-2xl px-4 py-16 text-center">
                    <ShoppingCart className="mx-auto size-12 text-gray-300" />
                    <p className="mt-4 text-lg font-medium text-gray-900">Your cart is empty</p>
                    <p className="mt-1 text-gray-500">Add some fragrances before checking out.</p>
                    <Link href="/" className="mt-6 inline-block">
                        <Button size="lg">Browse Fragrances</Button>
                    </Link>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <Head title="Checkout" />

            <div className="border-b border-gray-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center gap-4 px-4 py-4">
                    <Link
                        href="/cart"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 hover:text-gray-900"
                    >
                        <ArrowLeft className="size-4" />
                        Back to Cart
                    </Link>
                    <h1 className="text-lg font-semibold text-gray-900">Checkout</h1>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="mx-auto max-w-5xl px-4 py-8">
                <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                    {/* Left — Shipping & Payment */}
                    <div className="space-y-6 lg:col-span-2">
                        {/* Shipping Information */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900">Shipping Information</h2>
                            <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                                <div className="sm:col-span-2">
                                    <Label htmlFor="full_name">Full Name</Label>
                                    <Input
                                        id="full_name"
                                        value={form.full_name}
                                        readOnly
                                    />
                                </div>
                                <div className="sm:col-span-2">
                                    <Label htmlFor="address">Address</Label>
                                    <Input
                                        id="address"
                                        value={form.address}
                                        onChange={(e) => update('address', e.target.value)}
                                    />
                                    {errors.address && <p className="mt-1 text-sm text-red-600">{errors.address}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="city">City</Label>
                                    <Input
                                        id="city"
                                        value={form.city}
                                        onChange={(e) => update('city', e.target.value)}
                                    />
                                    {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city}</p>}
                                </div>
                                <div>
                                    <Label htmlFor="zip">ZIP Code</Label>
                                    <Input
                                        id="zip"
                                        value={form.zip}
                                        onChange={(e) => update('zip', e.target.value)}
                                    />
                                    {errors.zip && <p className="mt-1 text-sm text-red-600">{errors.zip}</p>}
                                </div>
                                <div className="sm:col-span-2">
                                    <Label htmlFor="phone">Phone Number</Label>
                                    <Input
                                        id="phone"
                                        type="tel"
                                        value={form.phone}
                                        onChange={(e) => update('phone', e.target.value)}
                                    />
                                    {errors.phone && <p className="mt-1 text-sm text-red-600">{errors.phone}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                            <h2 className="text-lg font-semibold text-gray-900">Payment Method</h2>
                            <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                                {PAYMENT_METHODS.map((method) => {
                                    const Icon = method.icon;
                                    const active = form.payment_method === method.id;
                                    return (
                                        <button
                                            key={method.id}
                                            type="button"
                                            onClick={() => update('payment_method', method.id)}
                                            className={`flex items-center gap-3 rounded-lg border p-4 text-left transition ${
                                                active
                                                    ? 'border-rose-600 bg-rose-50 ring-1 ring-rose-600'
                                                    : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                        >
                                            <Icon
                                                className={`size-5 ${active ? 'text-rose-600' : 'text-gray-400'}`}
                                            />
                                            <span
                                                className={`text-sm font-medium ${active ? 'text-rose-600' : 'text-gray-700'}`}
                                            >
                                                {method.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>
                        </div>
                    </div>

                    {/* Right — Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="sticky top-6 space-y-6">
                            <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                                <h2 className="text-lg font-semibold text-gray-900">Order Summary</h2>
                                <ul className="mt-4 divide-y divide-gray-100">
                                    {cart.map((item) => (
                                        <li key={item.id} className="flex items-center justify-between py-3">
                                            <div className="flex-1">
                                                <p className="text-sm font-medium text-gray-900">{item.name}</p>
                                                <p className="text-xs text-gray-500">Qty: {item.qty}</p>
                                            </div>
                                            <span className="text-sm font-medium text-gray-900">
                                                {currency(item.price * item.qty)}
                                            </span>
                                        </li>
                                    ))}
                                </ul>
                                <dl className="mt-4 space-y-2 border-t border-gray-100 pt-4 text-sm">
                                    <div className="flex justify-between">
                                        <dt className="text-gray-500">Subtotal ({cartCount} items)</dt>
                                        <dd className="font-medium text-gray-900">{currency(cartTotal)}</dd>
                                    </div>
                                    <div className="flex justify-between">
                                        <dt className="text-gray-500">Shipping</dt>
                                        <dd className="font-medium text-emerald-600">Free</dd>
                                    </div>
                                </dl>
                                <div className="mt-4 flex justify-between border-t border-gray-100 pt-4 text-base font-semibold text-gray-900">
                                    <span>Total</span>
                                    <span>{currency(cartTotal)}</span>
                                </div>
                                <Button
                                    type="submit"
                                    className="mt-6 w-full"
                                    size="lg"
                                    disabled={submitting}
                                >
                                    {submitting ? (
                                        <>
                                            <Loader2 className="size-4 animate-spin" />
                                            Processing...
                                        </>
                                    ) : (
                                        'Place Order'
                                    )}
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </form>
        </Layout>
    );
}
