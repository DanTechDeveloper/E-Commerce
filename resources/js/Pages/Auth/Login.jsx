import React from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';

export default function Login() {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect') || '';

    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false,
        redirect,
        cart: [],
    });

    function submit(e) {
        e.preventDefault();
        const cart = JSON.parse(localStorage.getItem('fragrance_cart') || '[]');
        setData('cart', cart);
        post('/login', {
            onSuccess: () => localStorage.removeItem('fragrance_cart'),
            onFinish: () => reset('password'),
        });
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <Head title="Log in" />
            <Card className="w-full max-w-md">
                <CardHeader>
                    <Link
                        href="/"
                        className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-800"
                    >
                        <ArrowLeft className="size-4" />
                        Browse Fragrances
                    </Link>
                    <CardTitle className="text-2xl">Welcome back</CardTitle>
                    <CardDescription>
                        Sign in to your E-Commerce account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {status && (
                        <div className="mb-4 text-sm font-medium text-green-600">
                            {status}
                        </div>
                    )}
                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                autoComplete="email"
                            />
                            {errors.email && (
                                <p className="text-sm text-red-600">{errors.email}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="password">Password</Label>
                            <Input
                                id="password"
                                type="password"
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                autoComplete="new-password"
                            />
                            {errors.password && (
                                <p className="text-sm text-red-600">{errors.password}</p>
                            )}
                        </div>
                        <label className="flex items-center gap-2 text-sm">
                            <input
                                type="checkbox"
                                checked={data.remember}
                                onChange={(e) => setData('remember', e.target.checked)}
                            />
                            Remember me
                        </label>
                        <Button type="submit" className="w-full" disabled={processing}>
                            Log in
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center text-sm">
                    Need an account?{' '}
                    <Link href={redirect ? `/register?redirect=${redirect}` : '/register'} className="ml-1 font-medium text-primary underline">
                        Sign up
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
