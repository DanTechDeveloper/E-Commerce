import { useState } from 'react';
import { Head, useForm } from '@inertiajs/react';
import AdminLayout from '@/Layouts/Admin/AdminLayout';
import { Plus, Pencil, Trash2, X } from 'lucide-react';

export default function Product({ products }) {
    const [showForm, setShowForm] = useState(false);
    const [editing, setEditing] = useState(null);

    const { data, setData, post, put, delete: destroy, processing, errors, reset } = useForm({
        name: '',
        price: '',
        category: '',
        image: null,
        quantity: '',
    });

    function openCreate() {
        reset();
        setEditing(null);
        setShowForm(true);
    }

    function openEdit(product) {
        setData({
            name: product.name,
            price: product.price,
            category: product.category,
            image: null,
            quantity: product.quantity,
        });
        setEditing(product.id);
        setShowForm(true);
    }

    function closeForm() {
        setShowForm(false);
        setEditing(null);
        reset();
    }

    function submit(e) {
        e.preventDefault();
        if (editing) {
            put(`/admin/products/${editing}`, {
                onSuccess: () => closeForm(),
            });
        } else {
            post('/admin/products', {
                onSuccess: () => closeForm(),
            });
        }
    }

    function deleteProduct(product) {
        if (confirm(`Delete "${product.name}"?`)) {
            destroy(`/admin/products/${product.id}`);
        }
    }

    return (
        <>
            <Head title="Products" />
            <AdminLayout>
                <div className="mb-6 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Products</h1>
                        <p className="text-sm text-gray-500">Manage your product catalog</p>
                    </div>
                    <button
                        onClick={openCreate}
                        className="flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
                    >
                        <Plus className="size-4" />
                        Add Product
                    </button>
                </div>

                {showForm && (
                    <div className="mb-6 rounded-lg border border-gray-200 bg-white p-6">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-lg font-semibold">
                                {editing ? 'Edit Product' : 'New Product'}
                            </h2>
                            <button onClick={closeForm} className="text-gray-400 hover:text-gray-600">
                                <X className="size-5" />
                            </button>
                        </div>
                        <form onSubmit={submit} className="space-y-4">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Name</label>
                                <input
                                    type="text"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                />
                                {errors.name && <p className="mt-1 text-sm text-red-500">{errors.name}</p>}
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Price</label>
                                    <input
                                        type="number"
                                        step="0.01"
                                        value={data.price}
                                        onChange={(e) => setData('price', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    />
                                    {errors.price && <p className="mt-1 text-sm text-red-500">{errors.price}</p>}
                                </div>
                                <div>
                                    <label className="mb-1 block text-sm font-medium text-gray-700">Category</label>
                                    <input
                                        type="text"
                                        value={data.category}
                                        onChange={(e) => setData('category', e.target.value)}
                                        className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                    />
                                    {errors.category && <p className="mt-1 text-sm text-red-500">{errors.category}</p>}
                                </div>
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Image</label>
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => setData('image', e.target.files[0])}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm file:mr-3 file:rounded file:border-0 file:bg-blue-50 file:px-3 file:py-1 file:text-sm file:font-medium file:text-blue-700 hover:file:bg-blue-100"
                                />
                                {errors.image && <p className="mt-1 text-sm text-red-500">{errors.image}</p>}
                                {editing && products.find(p => p.id === editing)?.image && (
                                    <div className="mt-2">
                                        <p className="mb-1 text-xs text-gray-400">Current image:</p>
                                        <img
                                            src={`/storage/${products.find(p => p.id === editing).image}`}
                                            className="h-16 w-16 rounded-lg object-cover"
                                        />
                                    </div>
                                )}
                            </div>
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">Quantity</label>
                                <input
                                    type="number"
                                    min="0"
                                    value={data.quantity}
                                    onChange={(e) => setData('quantity', e.target.value)}
                                    className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                                />
                                {errors.quantity && <p className="mt-1 text-sm text-red-500">{errors.quantity}</p>}
                            </div>
                            <div className="flex justify-end gap-3">
                                <button
                                    type="button"
                                    onClick={closeForm}
                                    className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="rounded-lg bg-blue-600 px-4 py-2 text-sm text-white hover:bg-blue-700 disabled:opacity-50"
                                >
                                    {editing ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </form>
                    </div>
                )}

                <div className="rounded-lg border border-gray-200 bg-white">
                    <table className="w-full">
                        <thead>
                            <tr className="border-b border-gray-200 text-left text-sm font-medium text-gray-500">
                                <th className="px-4 py-3">Image</th>
                                <th className="px-4 py-3">Name</th>
                                <th className="px-4 py-3">Price</th>
                                <th className="px-4 py-3">Stock</th>
                                <th className="px-4 py-3">Category</th>
                                <th className="px-4 py-3">Owner</th>
                                <th className="px-4 py-3 text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {products.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-4 py-12 text-center text-sm text-gray-400">
                                        No products yet. Click "Add Product" to create one.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="border-b border-gray-100 text-sm hover:bg-gray-50">
                                        <td className="px-4 py-3 text-gray-500">#{product.id}</td>
                                        <td className="px-4 py-3">
                                            {product.image ? (
                                                <img
                                                    src={`/storage/${product.image}`}
                                                    className="h-10 w-10 rounded-lg object-cover"
                                                />
                                            ) : (
                                                <span className="text-xs text-gray-400">—</span>
                                            )}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-gray-800">{product.name}</td>
                                        <td className="px-4 py-3">₱{parseFloat(product.price).toFixed(2)}</td>
                                        <td className="px-4 py-3">
                                            <span className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                                                product.quantity > 0
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-red-100 text-red-700'
                                            }`}>
                                                {product.quantity}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3">
                                            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs text-gray-600">
                                                {product.category}
                                            </span>
                                        </td>
                                        <td className="px-4 py-3 text-gray-500">{product.user?.name}</td>
                                        <td className="px-4 py-3 text-right">
                                            <button
                                                onClick={() => openEdit(product)}
                                                className="mr-2 rounded p-1 text-gray-400 hover:text-blue-600"
                                            >
                                                <Pencil className="size-4" />
                                            </button>
                                            <button
                                                onClick={() => deleteProduct(product)}
                                                className="rounded p-1 text-gray-400 hover:text-red-600"
                                            >
                                                <Trash2 className="size-4" />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </AdminLayout>
        </>
    );
}
