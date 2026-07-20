import React from 'react';
import { Link, usePage, useForm } from '@inertiajs/react';
import { LogIn, LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Layout({ children }) {
    const { auth } = usePage().props;
    const user = auth?.user;
    const isGuest = !user;

    const { post, processing } = useForm();

    function logout(e) {
        e.preventDefault();
        post('/logout');
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="border-b border-gray-200 bg-white">
                <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4">
                    <Link
                        href="/"
                        className="text-lg font-semibold text-gray-800"
                    >
                        E-Commerce
                    </Link>

                    <div className="flex items-center gap-3">
                        {isGuest ? (
                            // Guest = hindi naka-login
                            <>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link href="/login">
                                        <LogIn className="size-4" />
                                        Log in
                                    </Link>
                                </Button>
                                <Button size="sm" asChild>
                                    <Link href="/register">Sign up</Link>
                                </Button>
                            </>
                        ) : (
                            // Authenticated = naka-login
                            <>
                                <span className="hidden items-center gap-2 text-sm text-gray-600 sm:flex">
                                    <User className="size-4" />
                                    {user.name}
                                </span>
                                <form onSubmit={logout}>
                                    <Button
                                        type="submit"
                                        variant="outline"
                                        size="sm"
                                        disabled={processing}
                                    >
                                        <LogOut className="size-4" />
                                        Log out
                                    </Button>
                                </form>
                            </>
                        )}
                    </div>
                </div>
            </nav>
            <main>{children}</main>
        </div>
    );
}
