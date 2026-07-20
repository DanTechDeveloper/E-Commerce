import React from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';
import { LayoutDashboard, ShoppingBag, Package, Users, Settings, LogOut, Menu, X } from 'lucide-react';

export default function AdminLayout({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const [sidebarOpen, setSidebarOpen] = React.useState(false);
    const { post, processing } = useForm();

    function logout(e) {
        e.preventDefault();
        post('/logout');
    }

    const navItems = [
        { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
        { href: '/admin/products', label: 'Products', icon: ShoppingBag },
        { href: '/admin/orders', label: 'Orders', icon: Package },
        { href: '/admin/users', label: 'Users', icon: Users },
        { href: '/admin/settings', label: 'Settings', icon: Settings },
    ];

    return (
        <div className="flex h-screen overflow-hidden bg-gray-100">
            {sidebarOpen && (
                <div
                    className="fixed inset-0 z-20 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform lg:static lg:translate-x-0 ${
                    sidebarOpen ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex h-16 shrink-0 items-center gap-2 border-b border-gray-200 px-6">
                    <ShoppingBag className="size-6 text-blue-600" />
                    <span className="text-lg font-bold">Admin Panel</span>
                </div>

                <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                        >
                            <item.icon className="size-5" />
                            {item.label}
                        </Link>
                    ))}
                </nav>

                <div className="shrink-0 border-t border-gray-200 p-4">
                    <div className="mb-3 truncate text-sm text-gray-500">
                        {user?.name}
                    </div>
                    <Link
                        href="/"
                        className="mb-2 flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100"
                    >
                        Back to Store
                    </Link>
                    <button
                        onClick={logout}
                        disabled={processing}
                        className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50"
                    >
                        <LogOut className="size-4" />
                        Logout
                    </button>
                </div>
            </aside>

            <div className="flex flex-1 flex-col overflow-hidden">
                <header className="flex h-16 shrink-0 items-center justify-between border-b border-gray-200 bg-white px-4 lg:px-6">
                    <button
                        className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
                        onClick={() => setSidebarOpen(true)}
                    >
                        <Menu className="size-6" />
                    </button>

                    <div className="hidden lg:block">
                        <h1 className="text-lg font-semibold text-gray-800">
                            Welcome, {user?.name}
                        </h1>
                    </div>

                    <div className="flex items-center gap-3">
                        <span className="hidden text-sm text-gray-500 sm:block">
                            {user?.email}
                        </span>
                    </div>
                </header>

                <main className="flex-1 overflow-y-auto p-4 lg:p-6">{children}</main>

                <footer className="shrink-0 border-t border-gray-200 bg-white px-4 py-3 text-center text-sm text-gray-500 lg:px-6">
                    &copy; {new Date().getFullYear()} E-Commerce Admin Panel. All rights reserved.
                </footer>
            </div>
        </div>
    );
}
