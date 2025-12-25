import React from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { CheckCircleIcon } from '@heroicons/react/24/outline';

const CheckoutSuccess = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const orderId = searchParams.get('orderId');

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="text-center">
                        <CheckCircleIcon className="mx-auto h-16 w-16 text-green-400" />
                        <h2 className="mt-4 text-2xl font-bold text-gray-900">
                            Payment Successful!
                        </h2>
                        <p className="mt-2 text-sm text-gray-600">
                            Thank you for your purchase. Your order has been confirmed.
                        </p>
                        {orderId && (
                            <p className="mt-2 text-sm text-gray-500">
                                Order ID: {orderId}
                            </p>
                        )}
                    </div>

                    <div className="mt-8 space-y-4">
                        <button
                            onClick={() => navigate('/shop')}
                            className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Continue Shopping
                        </button>
                        <button
                            onClick={() => navigate('/')}
                            className="w-full flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                        >
                            Go to Home
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutSuccess; 