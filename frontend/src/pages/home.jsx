import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import ProductCard from '../components/ProductCard';
import { ProductSkeleton } from '../components/Skeleton';
import api from '../services/api';

const Home = () => {
    const [featuredProducts, setFeaturedProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const res = await api.get('/products');
                setFeaturedProducts(res.data.slice(0, 3));
            } catch (err) {
                console.error('Error fetching products for home:', err);
                setFeaturedProducts([
                    { name: "Sweater", price: 49.99, image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=870&auto=format&fit=crop' },
                    { name: "Bag", price: 49.99, image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?q=80&w=869&auto=format&fit=crop' },
                    { name: "Boots", price: 48.99, image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=870&auto=format&fit=crop' }
                ]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="bg-white dark:bg-zinc-950 transition-colors">
            {/* Hero */}
            <section className="bg-gray-50 dark:bg-zinc-900 py-12 px-6 sm:py-20 sm:px-12 text-center rounded-3xl mx-4 sm:mx-8 my-4 sm:my-8 border border-gray-100 dark:border-zinc-800 flex flex-col items-center">
                <motion.h1
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-4xl sm:text-7xl font-black mb-6 tracking-tighter text-gray-900 dark:text-white"
                >
                    NEW <span className="text-blue-600">ARRIVALS</span>
                </motion.h1>
                <p className="max-w-xl text-gray-600 dark:text-zinc-400 mb-8 text-sm sm:text-base">
                    Discover our latest collection of premium apparel and accessories designed for modern comfort and style.
                </p>
                <Link to="/shop">
                    <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-gray-900 dark:bg-white text-white dark:text-black px-8 py-4 rounded-2xl font-bold transition-all shadow-xl shadow-gray-200 dark:shadow-none"
                    >
                        EXPLORE THE SHOP
                    </motion.button>
                </Link>
            </section>

            {/* ...removed categories section... */}

            {/* Featured */}
            <section className="p-4 sm:p-8">
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-2xl sm:text-3xl font-bold dark:text-white">FEATURED PRODUCTS</h2>
                        <div className="h-1 w-12 bg-blue-600 mt-2 rounded-full" />
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {loading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                            {[1, 2, 3].map(i => <ProductSkeleton key={i} />)}
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {featuredProducts.map((product, i) => (
                                <ProductCard key={product._id || i} product={product} />
                            ))}
                        </div>
                    )}
                </AnimatePresence>
            </section>
        </div>
    );
};

export default Home;
