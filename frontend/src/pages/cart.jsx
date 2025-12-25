import React, { useEffect, useState } from 'react';
import { useCart } from '../context/cartContext';
import { useAuth } from '../context/authContext';
import formatPrice from '../utils/formatPrice';
import { motion, AnimatePresence } from 'framer-motion';
import CheckoutForm from '../components/CheckoutForm';
import ProfileCompletionModal from '../components/ProfileCompletionModal';
import { isProfileComplete } from '../utils/profileUtils';

export default function Cart() {
    const { cart, loadCart, updateItemQuantity, removeItem, cartError, loading, getCartTotal } = useCart();
    const { user } = useAuth();
    const [showCheckout, setShowCheckout] = useState(false);
    const [showProfileModal, setShowProfileModal] = useState(false);

    useEffect(() => {
        if (user) loadCart();
    }, [user]);

    const handleQuantityChange = async (productId, newQuantity) => {
        console.log('Changing quantity for product:', productId, 'to:', newQuantity);
        await updateItemQuantity(productId, newQuantity);
    };

    const handleRemoveItem = async (productId) => {
        console.log('Removing product:', productId);
        if (!productId) {
            console.error('Product ID is undefined');
            return;
        }
        await removeItem(productId);
    };

    const handleCheckout = () => {
        // Check if profile is complete before allowing checkout
        if (!isProfileComplete(user)) {
            setShowProfileModal(true);
            return;
        }
        setShowCheckout(true);
    };

    const handleCheckoutCancel = () => {
        setShowCheckout(false);
    };

    const handleCheckoutSuccess = () => {
        setShowCheckout(false);
        // Optionally redirect to success page or show success message
        alert('Payment successful! Your order has been placed.');
    };

    const closeProfileModal = () => {
        setShowProfileModal(false);
    };

    if (!user) {
        return <p className="p-8 text-center">Please log in to view your cart.</p>;
    }

    if (loading) {
        return <p className="p-8 text-center">Loading cart...</p>;
    }

    if (cartError) {
        return (
            <div className="p-8 text-center">
                <p className="text-red-500 mb-4">{cartError}</p>
                <button
                    onClick={loadCart}
                    className="bg-blue-600 text-white px-4 py-2 rounded"
                >
                    Retry
                </button>
            </div>
        );
    }

    if (!cart || !cart.items || cart.items.length === 0) {
        return <p className="p-8 text-center">Your cart is empty.</p>;
    }

    // Filter out items with null products
    const validItems = cart.items.filter(item => item.product !== null);

    if (validItems.length === 0) {
        return <p className="p-8 text-center">Your cart is empty.</p>;
    }

    const total = getCartTotal();

    if (showCheckout) {
        return (
            <div className="p-8">
                <CheckoutForm
                    onSuccess={handleCheckoutSuccess}
                    onCancel={handleCheckoutCancel}
                />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8 bg-white dark:bg-zinc-950 transition-colors min-h-screen">
            <h2 className="text-3xl font-black mb-8 dark:text-white tracking-tight">Your Shopping Cart</h2>

            {/* Profile Completion Warning */}
            {!isProfileComplete(user) && (
                <div className="mb-8 p-4 bg-amber-50 dark:bg-amber-900/10 border border-amber-200 dark:border-amber-900/30 rounded-2xl">
                    <div className="flex items-start">
                        <svg className="h-5 w-5 text-amber-500 mr-3 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                        </svg>
                        <div>
                            <h3 className="text-sm font-bold text-amber-900 dark:text-amber-400">
                                Action Required: Complete your profile
                            </h3>
                            <p className="text-sm text-amber-800/80 dark:text-amber-500/80 mt-1">
                                Please provide your shipping address in the profile section before proceeding to checkout.
                            </p>
                        </div>
                    </div>
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-4">
                    {validItems.map((item) => {
                        const product = item.product;
                        const productId = product?._id || item.product;

                        if (!product || !productId) return null;

                        return (
                            <motion.div
                                layout
                                key={productId}
                                className="bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 rounded-2xl p-4 flex items-center justify-between group hover:border-blue-500/30 dark:hover:border-blue-500/30 transition-colors"
                            >
                                <div className="flex items-center space-x-4">
                                    <div className="relative w-20 h-20 sm:w-24 sm:h-24 overflow-hidden rounded-xl border border-gray-100 dark:border-zinc-800">
                                        <img
                                            src={product.image || '/assets/placeholder.png'}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform group-hover:scale-110"
                                        />
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900 dark:text-white">{product.name}</h3>
                                        <p className="text-blue-600 dark:text-blue-400 font-bold mt-1">{formatPrice(product.price)}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-4 sm:space-y-0 sm:space-x-8">
                                    <div className="flex items-center bg-white dark:bg-zinc-900 rounded-xl border border-gray-200 dark:border-zinc-800 p-1 shadow-sm">
                                        <button
                                            onClick={() => handleQuantityChange(productId, item.quantity - 1)}
                                            disabled={loading}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 dark:text-zinc-400 transition-colors disabled:opacity-50"
                                        >
                                            -
                                        </button>
                                        <span className="font-bold w-10 text-center text-gray-900 dark:text-white">{item.quantity}</span>
                                        <button
                                            onClick={() => handleQuantityChange(productId, item.quantity + 1)}
                                            disabled={loading}
                                            className="w-8 h-8 rounded-lg flex items-center justify-center text-gray-500 hover:bg-gray-100 dark:hover:bg-zinc-800 dark:text-zinc-400 transition-colors disabled:opacity-50"
                                        >
                                            +
                                        </button>
                                    </div>

                                    <div className="text-right">
                                        <p className="font-black text-gray-900 dark:text-white text-lg">{formatPrice(item.quantity * product.price)}</p>
                                        <button
                                            onClick={() => handleRemoveItem(productId)}
                                            disabled={loading}
                                            className="text-red-500 text-xs font-bold hover:text-red-600 transition-colors disabled:opacity-50 mt-1 uppercase tracking-wider"
                                        >
                                            Remove
                                        </button>
                                    </div>
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                <div className="lg:col-span-1">
                    <div className="bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 rounded-3xl p-6 sticky top-24 shadow-sm">
                        <h3 className="text-xl font-bold dark:text-white mb-6">Order Summary</h3>

                        <div className="space-y-4 mb-4 pb-4 border-b border-gray-100 dark:border-zinc-800">
                            <div className="flex justify-between text-gray-600 dark:text-zinc-400">
                                <span>Subtotal</span>
                                <span>{formatPrice(total)}</span>
                            </div>
                            <div className="flex justify-between text-gray-600 dark:text-zinc-400">
                                <span>Shipping</span>
                                <span className="text-green-600">Free</span>
                            </div>
                        </div>

                        <div className="flex justify-between items-center mb-8">
                            <span className="text-lg font-bold dark:text-white">Total</span>
                            <span className="text-2xl font-black text-blue-600">{formatPrice(total)}</span>
                        </div>

                        <button
                            onClick={handleCheckout}
                            disabled={loading || validItems.length === 0}
                            className={`w-full py-4 px-6 rounded-2xl font-bold transition-all shadow-xl active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${isProfileComplete(user)
                                ? 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                                : 'bg-amber-500 hover:bg-amber-600 text-white shadow-amber-500/20'
                                }`}
                        >
                            {loading ? 'Processing...' :
                                isProfileComplete(user) ? 'Checkout Securely' : 'Complete Profile First'}
                        </button>

                        <p className="text-center text-xs text-gray-400 mt-4 px-4">
                            Taxes and shipping calculated at checkout. Secure SSL encrypted payment.
                        </p>
                    </div>
                </div>
            </div>

            {/* Profile Completion Modal */}
            <ProfileCompletionModal
                isOpen={showProfileModal}
                onClose={closeProfileModal}
                user={user}
            />
        </div>
    );
}
