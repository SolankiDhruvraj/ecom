import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import useDebounce from '../utils/useDebounce';
import { ProductSkeleton } from '../components/Skeleton';
import { motion, AnimatePresence } from 'framer-motion';

const Shop = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const { search } = useLocation();
    const queryParams = new URLSearchParams(search);
    const searchTerm = queryParams.get('search') || '';
    const debouncedSearchTerm = useDebounce(searchTerm, 500);

    const [currentPage, setCurrentPage] = useState(1);
    const productsPerPage = 8;

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                setError(null);
                const res = await api.get('/products');
                setProducts(res.data);
            } catch (err) {
                setError('Failed to load products');
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    const filteredProducts = React.useMemo(() => {
        if (!debouncedSearchTerm.trim()) return products;
        return products.filter(p =>
            p.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            p.category.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
            p.brand.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
        );
    }, [products, debouncedSearchTerm]);

    const displayedProducts = React.useMemo(() => {
        if (!debouncedSearchTerm.trim()) return products;
        return filteredProducts;
    }, [products, filteredProducts, debouncedSearchTerm]);

    const indexOfLastProduct = currentPage * productsPerPage;
    const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
    const currentProducts = displayedProducts.slice(indexOfFirstProduct, indexOfLastProduct);
    const totalPages = Math.ceil(displayedProducts.length / productsPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedSearchTerm]);

    if (error) {
        return (
            <div className="p-8 text-center bg-red-50 dark:bg-red-900/10 rounded-2xl mx-8 my-8 border border-red-100 dark:border-red-900/50">
                <h2 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">Error</h2>
                <p className="text-red-500/80">{error}</p>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-4 sm:p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                    Explore Our Collection
                </h1>
                <p className="text-gray-500 dark:text-zinc-400 mt-2">
                    Discover {displayedProducts.length} unique items across all categories.
                </p>
            </header>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 min-h-[400px]">
                <AnimatePresence mode="popLayout">
                    {loading ? (
                        Array.from({ length: 8 }).map((_, i) => (
                            <motion.div
                                key={`skeleton-${i}`}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                            >
                                <ProductSkeleton />
                            </motion.div>
                        ))
                    ) : (
                        currentProducts.map((p, index) => (
                            <ProductCard key={p._id} product={p} />
                        ))
                    )}
                </AnimatePresence>
            </div>

            {!loading && displayedProducts.length === 0 && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-center py-20"
                >
                    <p className="text-lg text-gray-500 dark:text-zinc-400">No products found matching "{searchTerm}"</p>
                </motion.div>
            )}

            {/* Pagination UI */}
            {!loading && totalPages > 1 && (
                <div className="flex justify-center mt-12 space-x-2">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(number => (
                        <button
                            key={number}
                            onClick={() => paginate(number)}
                            className={`w-10 h-10 flex items-center justify-center rounded-xl transition-all duration-200 font-medium ${currentPage === number
                                ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30'
                                : 'bg-white dark:bg-zinc-900 text-gray-600 dark:text-zinc-400 border border-gray-100 dark:border-zinc-800 hover:bg-gray-50 dark:hover:bg-zinc-800'
                                }`}
                        >
                            {number}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Shop;
