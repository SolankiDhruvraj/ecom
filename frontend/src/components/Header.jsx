import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import { useCart } from '../context/cartContext';
import { useTheme } from '../context/themeContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Moon, ShoppingBag, User as UserIcon, LogOut, Search } from 'lucide-react';

export default function Header() {
    const { user, logout } = useAuth();
    const { getCartItemCount, cart } = useCart();
    const { isDarkMode, toggleTheme } = useTheme();
    const [cartItemCount, setCartItemCount] = useState(0);

    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const count = getCartItemCount();
        setCartItemCount(count);
    }, [cart, getCartItemCount]);

    const handleLogout = () => {
        logout();
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
        if (query.trim()) {
            navigate(`/shop?search=${encodeURIComponent(query)}`);
        } else {
            navigate('/shop');
        }
    };

    return (
        <header className="sticky top-0 z-50 glass border-b border-gray-100 dark:border-zinc-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16 sm:h-20">
                    <div className="flex items-center space-x-8">
                        <Link to="/" className="text-2xl font-black text-gray-900 dark:text-white tracking-tighter">
                            ECOM<span className="text-blue-600">.</span>
                        </Link>

                        <nav className="hidden lg:flex space-x-1">
                            <Link
                                to="/shop"
                                className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/50"
                            >
                                Shop
                            </Link>
                            {user?.userType === 'admin' && (
                                <Link to="/admin" className="px-4 py-2 text-sm font-medium text-gray-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors rounded-xl hover:bg-gray-50 dark:hover:bg-zinc-800/50">
                                    Admin Panel
                                </Link>
                            )}
                        </nav>
                    </div>

                    {/* Search Bar */}
                    <div className="hidden md:flex flex-1 max-w-md mx-8 px-4 py-2 bg-gray-50 dark:bg-zinc-800/50 rounded-2xl group focus-within:ring-2 focus-within:ring-blue-500/50 transition-all border border-transparent dark:border-zinc-800">
                        <Search className="text-gray-400 group-focus-within:text-blue-500 transition-colors" size={18} />
                        <input
                            type="text"
                            placeholder="Find your favorite products..."
                            value={searchQuery}
                            onChange={handleSearch}
                            className="bg-transparent border-none focus:ring-0 text-sm w-full ml-2 text-gray-800 dark:text-zinc-100 placeholder-gray-400"
                        />
                    </div>

                    <div className="flex items-center space-x-2 sm:space-x-4">
                        {/* Theme Toggle */}
                        <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={toggleTheme}
                            className="p-2.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 text-gray-600 dark:text-zinc-400 transition-colors border border-transparent dark:border-zinc-800"
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </motion.button>

                        <Link to="/cart" className="relative p-2.5 rounded-2xl hover:bg-gray-50 dark:hover:bg-zinc-800/50 text-gray-600 dark:text-zinc-400 transition-colors border border-transparent dark:border-zinc-800">
                            <ShoppingBag size={20} />
                            <AnimatePresence>
                                {cartItemCount > 0 && (
                                    <motion.span
                                        initial={{ scale: 0 }}
                                        animate={{ scale: 1 }}
                                        exit={{ scale: 0 }}
                                        className="absolute -top-1 -right-1 bg-blue-600 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white dark:border-zinc-900"
                                    >
                                        {cartItemCount}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>

                        <div className="h-6 w-px bg-gray-200 dark:bg-zinc-800 hidden sm:block mx-2" />

                        {user ? (
                            <div className="flex items-center space-x-2">
                                <Link to="/profile" className="flex items-center space-x-2 p-1 pl-3 pr-1 bg-gray-50 dark:bg-zinc-800/50 border border-gray-100 dark:border-zinc-800 rounded-2xl hover:bg-gray-100 dark:hover:bg-zinc-800 transition-colors group">
                                    <span className="text-xs font-semibold text-gray-700 dark:text-zinc-300 hidden sm:block">
                                        {user.name.split(' ')[0]}
                                    </span>
                                    <div className="p-1.5 bg-white dark:bg-zinc-900 rounded-xl group-hover:bg-blue-600 group-hover:text-white transition-all shadow-sm">
                                        <UserIcon size={14} />
                                    </div>
                                </Link>
                                <button onClick={handleLogout} className="p-2.5 rounded-2xl hover:bg-red-50 dark:hover:bg-red-900/10 text-gray-400 hover:text-red-500 transition-colors">
                                    <LogOut size={20} />
                                </button>
                            </div>
                        ) : (
                                <div className="flex items-center space-x-3">
                                    <Link to="/login" className="text-sm font-bold text-gray-600 dark:text-zinc-400 hover:text-gray-900 dark:hover:text-white transition-colors">
                                        Sign In
                                </Link>
                                    <Link to="/register" className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-2xl transition-all shadow-lg shadow-blue-500/20 active:scale-95">
                                        Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </header>
    );
}
