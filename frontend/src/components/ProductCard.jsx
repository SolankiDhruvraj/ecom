import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingCart, Plus, Minus } from 'lucide-react';
import formatPrice from '../utils/formatPrice';
import { useCart } from '../context/cartContext';
import { useAuth } from '../context/authContext';

const ProductCard = ({ product }) => {
    const { addItem, updateItemQuantity, cart, loading } = useCart();
    const { user } = useAuth();
    const navigate = useNavigate();

    const cartItem = cart.items?.find(item => item.product?._id === product._id);
    const currentQuantity = cartItem?.quantity || 0;

    const handleAddToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!user) {
            navigate('/login');
            return;
        }
        await addItem(product._id, 1);
    };

    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="group bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 dark:border-zinc-800 flex flex-col h-full"
        >
            <Link to={`/product/${product._id}`} className="block relative overflow-hidden rounded-xl aspect-square mb-4">
                <motion.img
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.4 }}
                    src={(product.images && product.images.length > 0 ? product.images[0] : product.image) || '/assets/placeholder.png'}
                    alt={product.name}
                    className="h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300" />
            </Link>

            <div className="flex flex-col flex-grow">
                <Link to={`/product/${product._id}`}>
                    <h3 className="font-semibold text-gray-800 dark:text-zinc-100 line-clamp-1 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {product.name}
                    </h3>
                </Link>
                <p className="text-sm text-gray-500 dark:text-zinc-400 mt-1 line-clamp-2">
                    {product.brand}
                </p>

                <div className="mt-4 flex items-center justify-between">
                    <span className="text-lg font-bold text-gray-900 dark:text-white">
                        {formatPrice(product.price)}
                    </span>

                    {currentQuantity > 0 ? (
                        <div className="flex items-center bg-gray-100 dark:bg-zinc-800 rounded-lg p-1">
                            <button
                                onClick={(e) => { e.preventDefault(); updateItemQuantity(product._id, currentQuantity - 1); }}
                                className="p-1 hover:text-red-500 transition-colors"
                            >
                                <Minus size={16} />
                            </button>
                            <span className="mx-2 text-sm font-medium w-4 text-center">{currentQuantity}</span>
                            <button
                                onClick={(e) => { e.preventDefault(); updateItemQuantity(product._id, currentQuantity + 1); }}
                                className="p-1 hover:text-green-500 transition-colors"
                            >
                                <Plus size={16} />
                            </button>
                        </div>
                    ) : (
                        <motion.button
                            whileTap={{ scale: 0.95 }}
                            onClick={handleAddToCart}
                            disabled={loading}
                            className="bg-blue-600 hover:bg-blue-700 text-white p-2.5 rounded-xl transition-colors disabled:opacity-50 shadow-lg shadow-blue-500/20"
                        >
                            <ShoppingCart size={18} />
                        </motion.button>
                    )}
                </div>
            </div>
        </motion.div>
    );
};

export default React.memo(ProductCard);
