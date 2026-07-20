import { useCallback, useEffect, useState } from 'react';

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

export function useCart() {
    const [cart, setCart] = useState(readCart);

    // Persist on change
    useEffect(() => {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
        } catch {
            /* ignore */
        }
    }, [cart]);

    // Sync across tabs / other page instances
    useEffect(() => {
        const onStorage = (e) => {
            if (e.key === STORAGE_KEY) setCart(readCart());
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, []);

    const addToCart = useCallback((fragrance, qty = 1) => {
        setCart((prev) => {
            const existing = prev.find((item) => item.id === fragrance.id);
            const currentQty = existing ? existing.qty : 0;
            const maxStock = fragrance.quantity ?? 0;

            if (currentQty + qty > maxStock) return prev;

            if (existing) {
                return prev.map((item) =>
                    item.id === fragrance.id
                        ? { ...item, qty: item.qty + qty }
                        : item
                );
            }
            return [...prev, { ...fragrance, qty }];
        });
    }, []);

    const updateQty = useCallback((id, delta) => {
        setCart((prev) =>
            prev
                .map((item) => {
                    const newQty = item.qty + delta;
                    if (newQty > item.quantity) return item;
                    return { ...item, qty: newQty };
                })
                .filter((item) => item.qty > 0)
        );
    }, []);

    const removeItem = useCallback((id) => {
        setCart((prev) => prev.filter((item) => item.id !== id));
    }, []);

    const clearCart = useCallback(() => setCart([]), []);

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
    };
}
