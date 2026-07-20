import { useCallback, useEffect, useState } from 'react';
import { usePage, router } from '@inertiajs/react';

const STORAGE_KEY = 'fragrance_cart';

function readCart() {
    if (typeof window === 'undefined') return [];
    try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function syncToDb(cart) {
    router.post('/cart/sync', { items: cart.map((i) => ({ id: i.id, qty: i.qty })) }, {
        preserveState: true,
        preserveScroll: true,
    });
}

export function useCart() {
    const { auth } = usePage().props;
    const isLoggedIn = !!auth?.user;

    const [cart, setCart] = useState(isLoggedIn ? [] : readCart);
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
        if (!isLoggedIn) {
            setLoaded(true);
            return;
        }
        fetch('/cart/items')
            .then((res) => res.json())
            .then((data) => {
                setCart(data);
                setLoaded(true);
            });
    }, [isLoggedIn]);

    useEffect(() => {
        if (isLoggedIn || !loaded) return;
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        } catch { /* ignore */ }
    }, [cart, isLoggedIn, loaded]);

    useEffect(() => {
        if (isLoggedIn) return;
        const onStorage = (e) => {
            if (e.key === STORAGE_KEY) setCart(readCart());
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, [isLoggedIn]);

    const addToCart = useCallback((fragrance, qty = 1) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === fragrance.id);
            const currentQty = existing ? existing.qty : 0;
            const maxStock = fragrance.quantity ?? 0;

            if (currentQty + qty > maxStock) return prev;

            const next = existing
                ? prev.map((item) =>
                      item.id === fragrance.id
                          ? { ...item, qty: item.qty + qty }
                          : item
                  )
                : [...prev, { ...fragrance, qty }];

            if (isLoggedIn) syncToDb(next);
            return next;
        });
    }, [isLoggedIn]);

    const updateQty = useCallback((id, delta) => {
        setCart((prev) => {
            const next = prev
                .map((item) => {
                    const newQty = item.qty + delta;
                    if (newQty > item.quantity) return item;
                    return { ...item, qty: newQty };
                })
                .filter((item) => item.qty > 0);

            if (isLoggedIn) syncToDb(next);
            return next;
        });
    }, [isLoggedIn]);

    const removeItem = useCallback((id) => {
        setCart((prev) => {
            const next = prev.filter((item) => item.id !== id);
            if (isLoggedIn) syncToDb(next);
            return next;
        });
    }, [isLoggedIn]);

    const clearCart = useCallback(() => {
        setCart([]);
        if (isLoggedIn) {
            router.post('/cart/clear', {}, {
                preserveState: true,
                preserveScroll: true,
            });
        } else {
            try {
                window.localStorage.removeItem(STORAGE_KEY);
            } catch { /* ignore */ }
        }
    }, [isLoggedIn]);

    const cartCount = cart.reduce((sum, item) => sum + item.qty, 0);
    const cartTotal = cart.reduce((sum, item) => sum + item.qty * item.price, 0);

    return {
        cart,
        cartCount,
        cartTotal,
        addToCart,
        updateQty,
        removeItem,
        clearCart,
        loaded,
    };
}
