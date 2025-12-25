import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './authContext';

const CartContext = createContext();

export function CartProvider({ children }) {
    const [cart, setCart] = useState({ items: [] });
    const [cartError, setCartError] = useState(null);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();

    // Load cart when user changes
    useEffect(() => {
        if (user) {
            loadCart();
        } else {
            setCart({ items: [] });
        }
    }, [user]);

    const loadCart = React.useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            setCartError(null);
            const res = await api.get('/cart');
            setCart(res.data);
            setCartError(null);
        } catch (err) {
            setCart({ items: [] });
            setCartError('Failed to load cart');
        } finally {
            setLoading(false);
        }
    }, [user]);

    const addItem = React.useCallback(async (productId, quantity = 1) => {
        if (!user) return;
        try {
            setLoading(true);
            setCartError(null);
            await api.post('/cart/addToCart', {
                productId: String(productId),
                quantity: Number(quantity)
            });
            await loadCart();
        } catch (err) {
            if (err.response?.data?.errors) {
                const errorMessage = err.response.data.errors.map(e => e.message).join(', ');
                setCartError(errorMessage);
            } else {
                setCartError(err.response?.data?.message || 'Failed to add item to cart');
            }
        } finally {
            setLoading(false);
        }
    }, [user, loadCart]);

    const updateItemQuantity = React.useCallback(async (productId, newQuantity) => {
        if (!user) return;
        try {
            setLoading(true);
            setCartError(null);
            if (newQuantity <= 0) {
                await api.delete(`/cart/removeItem`, {
                    data: { productId: String(productId) }
                });
                await loadCart();
                return;
            }
            await api.put(`/cart/updateQuantity`, {
                productId: String(productId),
                quantity: Number(newQuantity)
            });
            await loadCart();
        } catch (err) {
            setCartError(err.response?.data?.message || 'Failed to update quantity');
        } finally {
            setLoading(false);
        }
    }, [user, loadCart]);

    const removeItem = React.useCallback(async (productId) => {
        if (!user) return;
        try {
            setLoading(true);
            setCartError(null);
            await api.delete(`/cart/removeItem`, {
                data: { productId: String(productId) }
            });
            await loadCart();
        } catch (err) {
            setCartError(err.response?.data?.message || 'Failed to remove item');
        } finally {
            setLoading(false);
        }
    }, [user, loadCart]);

    const getCartItemCount = React.useCallback(() => {
        return cart.items?.reduce((total, item) => {
            if (!item.product) return total;
            return total + (item.quantity || 0);
        }, 0) || 0;
    }, [cart.items]);

    const getCartTotal = React.useCallback(() => {
        return cart.items?.reduce((total, item) => {
            if (!item.product) return total;
            return total + (item.quantity * (item.product?.price || 0));
        }, 0) || 0;
    }, [cart.items]);

    const clearCart = React.useCallback(async () => {
        if (!user) return;
        try {
            setLoading(true);
            setCartError(null);
            await api.delete('/cart/clearCart');
            setCart({ items: [] });
            setCartError(null);
        } catch (err) {
            setCartError(err.response?.data?.message || 'Failed to clear cart');
        } finally {
            setLoading(false);
        }
    }, [user]);

    const getCartId = React.useCallback(() => {
        return cart._id;
    }, [cart._id]);

    const value = React.useMemo(() => ({
        cart,
        loadCart,
        addItem,
        updateItemQuantity,
        removeItem,
        clearCart,
        getCartId,
        cartError,
        loading,
        getCartItemCount,
        getCartTotal
    }), [cart, loadCart, addItem, updateItemQuantity, removeItem, clearCart, getCartId, cartError, loading, getCartItemCount, getCartTotal]);

    return (
        <CartContext.Provider value={value}>
            {children}
        </CartContext.Provider>
    );
}

export const useCart = () => {
    const context = useContext(CartContext);
    if (!context) {
        throw new Error('useCart must be used within a CartProvider');
    }
    return context;
};
