import React, { useState, useEffect } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useCart } from '../context/cartContext';
import api from '../services/api';

// Load Stripe
const stripePromise = loadStripe(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);

// Debug Stripe loading
console.log('Stripe publishable key:', import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY);
stripePromise.then(stripe => {
    console.log('Stripe loaded successfully:', !!stripe);
}).catch(err => {
    console.error('Stripe loading error:', err);
});

const cardElementOptions = {
    style: {
        base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
                color: '#aab7c4',
            },
        },
        invalid: {
            color: '#9e2146',
        },
    },
};

const CheckoutFormContent = ({ onSuccess, onCancel }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [clientSecret, setClientSecret] = useState('');
    const [paymentIntentId, setPaymentIntentId] = useState('');
    const { user } = useAuth();
    const { getCartTotal, clearCart, getCartId } = useCart();
    const navigate = useNavigate();

    // Debug Stripe Elements
    useEffect(() => {
        console.log('Stripe Elements loaded:', { stripe: !!stripe, elements: !!elements });
    }, [stripe, elements]);

    useEffect(() => {
        createPaymentIntent();
    }, []);

    const createPaymentIntent = async () => {
        try {
            console.log('Creating payment intent...');
            console.log('User:', user);
            console.log('API headers:', api.defaults.headers.common);

            const response = await api.post('/checkout/create-payment-intent', {});

            if (response.data.success) {
                setClientSecret(response.data.clientSecret);
                setPaymentIntentId(response.data.paymentIntentId);
            } else {
                setError(response.data.message || 'Failed to create payment intent');
            }
        } catch (err) {
            console.error('Error creating payment intent:', err);
            setError(err.response?.data?.message || 'Failed to create payment intent');
        }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!stripe || !elements || !clientSecret) {
            return;
        }

        setLoading(true);
        setError(null);

        try {
            const { error: stripeError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: {
                        name: user.name || 'Customer',
                        email: user.email,
                    },
                },
            });

            if (stripeError) {
                setError(stripeError.message);
                setLoading(false);
                return;
            }

            if (paymentIntent.status === 'succeeded') {
                // Confirm payment with backend
                const confirmResponse = await api.post('/checkout/confirm-payment', {
                    paymentIntentId: paymentIntent.id,
                    cartId: getCartId(),
                });

                if (confirmResponse.data.success) {
                    clearCart();
                    // Redirect to success page with order ID
                    navigate(`/checkout/success?orderId=${confirmResponse.data.orderId}`);
                } else {
                    setError(confirmResponse.data.message || 'Payment confirmation failed');
                }
            } else {
                setError('Payment failed. Please try again.');
            }
        } catch (err) {
            console.error('Payment error:', err);
            setError(err.response?.data?.message || 'Payment failed');
        } finally {
            setLoading(false);
        }
    };

    const total = getCartTotal();

    return (
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto">
            <h2 className="text-2xl font-bold mb-6 text-center">Checkout</h2>

            <div className="mb-6">
                <div className="flex justify-between items-center mb-4">
                    <span className="font-semibold text-lg">Total Amount:</span>
                    <span className="text-2xl font-bold text-green-600">${total.toFixed(2)}</span>
                </div>
            </div>

            {error && (
                <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="border border-gray-300 rounded-lg p-4">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                        Card Details
                    </label>
                    <CardElement options={cardElementOptions} />
                </div>

                <div className="space-y-3">
                    <button
                        type="submit"
                        disabled={loading || !stripe || total <= 0}
                        className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                        {loading ? 'Processing Payment...' : `Pay $${total.toFixed(2)}`}
                    </button>

                    <button
                        type="button"
                        onClick={onCancel}
                        disabled={loading}
                        className="w-full bg-gray-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-600 disabled:opacity-50 transition-colors"
                    >
                        Cancel
                    </button>
                </div>
            </form>

            <div className="mt-6 text-sm text-gray-600 text-center">
                <p>Your payment is secured by Stripe</p>
                <p className="mt-1">Test card: 4242 4242 4242 4242</p>
            </div>
        </div>
    );
};

const CheckoutForm = ({ onSuccess, onCancel }) => {
    return (
        <Elements stripe={stripePromise}>
            <CheckoutFormContent onSuccess={onSuccess} onCancel={onCancel} />
        </Elements>
    );
};

export default CheckoutForm; 