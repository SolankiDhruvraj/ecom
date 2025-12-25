import React from 'react';
import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import formatPrice from '../utils/formatPrice';
import { useCart } from '../context/cartContext';
import { useAuth } from '../context/authContext';

export default function ProductDetails() {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { addItem, updateItemQuantity, cart, cartError } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [carouselIndex, setCarouselIndex] = useState(0);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const { data } = await api.get(`/products/${id}`);
                setProduct(data);
            } catch (err) {
                console.error('Error fetching product:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) return <p className="p-8 text-center">Loading product...</p>;
    if (!product) return <p className="p-8 text-center text-red-500">Product not found</p>;

    // Get images array or fallback to [image] or placeholder
    const images = (product.images && product.images.length > 0)
        ? product.images
        : product.image ? [product.image] : ['/assets/placeholder.png'];

    const handlePrev = () => {
        setCarouselIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
    };
    const handleNext = () => {
        setCarouselIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    };

    // Check if product is in cart and get its quantity
    const cartItem = cart.items?.find(item => item.product?._id === product._id);
    const currentQuantity = cartItem?.quantity || 0;

    const handleAddToCart = async () => {
        if (!user) {
            alert('Please log in to add items to your cart.');
            navigate('/login');
            return;
        }
        await addItem(product._id, 1);
    };

    const handleBuy = async () => {
        if (!user) {
            alert('Please log in to buy products.');
            navigate('/login');
            return;
        }
        await addItem(product._id, 1);
        navigate('/cart'); // or '/checkout' if you have a direct checkout page
    };

    const handleIncreaseQuantity = async () => {
        if (!user) {
            alert('Please log in to modify your cart.');
            navigate('/login');
            return;
        }
        await updateItemQuantity(product._id, currentQuantity + 1);
    };

    const handleDecreaseQuantity = async () => {
        if (!user) {
            alert('Please log in to modify your cart.');
            navigate('/login');
            return;
        }
        await updateItemQuantity(product._id, currentQuantity - 1);
    };

    return (
        <div className="max-w-4xl mx-auto p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="relative">
                <img
                    src={images[carouselIndex]}
                    alt={product.name}
                    className="w-full h-96 object-cover rounded"
                />
                {images.length > 1 && (
                    <>
                        <button
                            onClick={handlePrev}
                            className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 shadow hover:bg-opacity-100"
                        >
                            &#8592;
                        </button>
                        <button
                            onClick={handleNext}
                            className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white bg-opacity-70 rounded-full p-2 shadow hover:bg-opacity-100"
                        >
                            &#8594;
                        </button>
                        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-1">
                            {images.map((img, idx) => (
                                <span
                                    key={idx}
                                    className={`inline-block w-2 h-2 rounded-full ${idx === carouselIndex ? 'bg-blue-600' : 'bg-gray-300'}`}
                                />
                            ))}
                        </div>
                    </>
                )}
            </div>
            <div>
                <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
                <p className="text-gray-600 text-lg mb-4">{formatPrice(product.price)}</p>
                <p className="mb-6">{product.description || 'No description available.'}</p>
                <div className="flex space-x-4">
                    {currentQuantity > 0 ? (
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleDecreaseQuantity}
                                disabled={loading}
                                className="bg-red-500 text-white w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-red-600"
                            >
                                -
                            </button>
                            <span className="font-semibold min-w-[2rem] text-center">{currentQuantity}</span>
                            <button
                                onClick={handleIncreaseQuantity}
                                disabled={loading}
                                className="bg-green-500 text-white w-8 h-8 rounded-full flex items-center justify-center disabled:opacity-50 hover:bg-green-600"
                            >
                                +
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={handleAddToCart}
                            className="bg-blue-600 text-white px-6 py-2 rounded"
                        >
                            Add to Cart
                        </button>
                    )}
                    <button
                        onClick={handleBuy}
                        className="bg-green-600 text-white px-6 py-2 rounded"
                    >
                        Buy
                    </button>
                </div>
                {cartError && (
                    <p className="text-red-500 text-sm mt-1">{cartError}</p>
                )}
            </div>
        </div>
    );
}
