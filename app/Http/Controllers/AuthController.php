<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use App\Models\User;
use App\Models\CartItem;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function create()
    {
        return Inertia::render('Auth/Login');
    }

    public function store(Request $request)
    {
        $credentials = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        if (!Auth::attempt($credentials, $request->boolean('remember'))) {
            return back()->withErrors([
                'email' => 'The provided credentials do not match our records.',
            ]);
        }

        $request->session()->regenerate();

        $user = Auth::user();

        $cart = $request->input('cart', []);

        foreach ($cart as $item) {
            CartItem::updateOrCreate(
                ['user_id' => $user->id, 'product_id' => $item['id']],
                ['quantity' => $item['qty'] ?? 1]
            );
        }

        $redirect = $request->input('redirect', '/');

        if ($user->role === 'admin') {
            return redirect()->to('/admin');
        }

        return redirect()->to($redirect);
    }

    public function createRegister()
    {
        return Inertia::render('Auth/Register');
    }

    public function storeRegister(Request $request)
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users'],
            'password' => ['required', 'confirmed', Password::default()],
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        Auth::login($user);

        $cart = $request->input('cart', []);

        foreach ($cart as $item) {
            CartItem::updateOrCreate(
                ['user_id' => $user->id, 'product_id' => $item['id']],
                ['quantity' => $item['qty'] ?? 1]
            );
        }

        if ($user->role === 'admin') {
            return redirect()->to('/admin');
        }

        $redirect = $request->input('redirect', '/');

        return redirect()->to($redirect);
    }

    public function destroy(Request $request)
    {
        Auth::guard('web')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->to('/');
    }
}
