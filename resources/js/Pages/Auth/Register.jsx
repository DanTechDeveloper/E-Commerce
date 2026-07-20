import React from 'react';
import { Head, useForm, Link } from '@inertiajs/react';
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

export default function Register() {
    const params = new URLSearchParams(window.location.search);
    const redirect = params.get('redirect') || '';

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
        redirect,
        cart: [],
    });

    function submit(e) {
        e.preventDefault();
        const cart = JSON.parse(localStorage.getItem('fragrance_cart') || '[]');
        setData('cart', cart);
        post('/register', {
            onSuccess: () => localStorage.removeItem('fragrance_cart'),
            onFinish: () => reset('password', 'password_confirmation'),
        });
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
            <Head title="Register" />
            <Card className="w-full max-w-md">
                <CardHeader>
                    <Link
                        href="/"
                        className="mb-2 inline-flex items-center gap-1 text-sm font-medium text-gray-500 hover:text-gray-800"
                    >
                        <ArrowLeft className="size-4" />
                        Browse Fragrances
                    </Link>
                    <CardTitle className="text-2xl">Create an account</CardTitle>
                    <CardDescription>
                        Sign up for your E-Commerce account
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={submit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Name</Label>
                            <Input
                                id="name"
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                autoComplete="name"
                            />
                            {errors.name && (
                                <p className="text-sm text-red-600">{errors.name}</p>
                            )}
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="email">Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                autoComplete="username"
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
                        <div className="space-y-2">
                            <Label htmlFor="password_confirmation">Confirm Password</Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                autoComplete="new-password"
                            />
                            {errors.password_confirmation && (
                                <p className="text-sm text-red-600">{errors.password_confirmation}</p>
                            )}
                        </div>
                        <Button type="submit" className="w-full" disabled={processing}>
                            Sign up
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="justify-center text-sm">
                    Already registered?{' '}
                    <Link href={redirect ? `/login?redirect=${redirect}` : '/login'} className="ml-1 font-medium text-primary underline">
                        Sign in
                    </Link>
                </CardFooter>
            </Card>
        </div>
    );
}
