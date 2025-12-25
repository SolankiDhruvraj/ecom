import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/authContext';
import { z } from 'zod';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User as UserIcon } from 'lucide-react';

const loginSchema = z.object({
    email: z.string().email('Enter a valid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    userType: z.enum(['user', 'admin'], { required_error: 'Please select user type' }),
});

export default function Login() {
    const { login, authError, loading } = useAuth();
    const [form, setForm] = useState({
        email: '',
        password: '',
        userType: 'user'
    });
    const [errors, setErrors] = useState({});
    const [successMessage, setSuccessMessage] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Handle state passed from registration
    useEffect(() => {
        if (location.state?.message) {
            setSuccessMessage(location.state.message);
            // Clear the state to prevent showing the message again on refresh
            navigate(location.pathname, { replace: true });
        }
        if (location.state?.userType) {
            setForm(prev => ({ ...prev, userType: location.state.userType }));
        }
    }, [location, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            loginSchema.parse(form);
            const result = await login(form.email, form.password, form.userType);
            if (result.success) {
                // Redirect based on user type
                if (form.userType === 'admin') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            }
        } catch (err) {
            if (err.name === 'ZodError') {
                const fieldErrors = {};
                err.errors.forEach(({ path, message }) => {
                    fieldErrors[path[0]] = message;
                });
                setErrors(fieldErrors);
            }
        }
    };

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 flex flex-col justify-center py-12 px-4 sm:px-6 lg:px-8 transition-colors">
            <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="inline-flex items-center justify-center p-4 bg-blue-600 rounded-3xl shadow-xl shadow-blue-500/20 mb-8"
                >
                    <UserIcon size={32} className="text-white" />
                </motion.div>
                <h2 className="text-4xl font-black text-gray-900 dark:text-white tracking-tighter">
                    Welcome Back
                </h2>
                <p className="mt-3 text-gray-500 dark:text-zinc-400 font-medium tracking-tight">
                    Securely sign in to your accounts
                </p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-gray-50/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-gray-100 dark:border-zinc-800 py-10 px-8 shadow-2xl rounded-[2.5rem] sm:px-12">
                    {/* Success Message */}
                    {successMessage && (
                        <div className="mb-8 rounded-2xl bg-green-50 dark:bg-green-900/20 p-4 border border-green-100 dark:border-green-900/30">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-bold text-green-800 dark:text-green-400 leading-tight">
                                        {successMessage}
                                    </p>
                                </div>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8 text-left">
                        {/* User Type Selection */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-zinc-500 mb-4 ">
                                I want to sign in as:
                            </label>
                            <div className="grid grid-cols-2 gap-4">
                                <label className={`relative flex cursor-pointer rounded-2xl border p-4 transition-all ${form.userType === 'user'
                                    ? 'border-blue-500 bg-white dark:bg-zinc-800 shadow-lg shadow-blue-500/10'
                                    : 'border-gray-200 dark:border-zinc-800 bg-transparent hover:border-gray-300 dark:hover:border-zinc-700'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="userType"
                                        value="user"
                                        checked={form.userType === 'user'}
                                        onChange={handleInputChange}
                                        className="sr-only"
                                    />
                                    <div className="w-full">
                                        <div className="text-sm font-black text-gray-900 dark:text-white">Customer</div>
                                        {form.userType === 'user' && (
                                            <div className="absolute top-2 right-2 text-blue-500">
                                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </label>

                                <label className={`relative flex cursor-pointer rounded-2xl border p-4 transition-all ${form.userType === 'admin'
                                    ? 'border-blue-500 bg-white dark:bg-zinc-800 shadow-lg shadow-blue-500/10'
                                    : 'border-gray-200 dark:border-zinc-800 bg-transparent hover:border-gray-300 dark:hover:border-zinc-700'
                                    }`}>
                                    <input
                                        type="radio"
                                        name="userType"
                                        value="admin"
                                        checked={form.userType === 'admin'}
                                        onChange={handleInputChange}
                                        className="sr-only"
                                    />
                                    <div className="w-full text-left">
                                        <div className="text-sm font-black text-gray-900 dark:text-white">Admin</div>
                                        {form.userType === 'admin' && (
                                            <div className="absolute top-2 right-2 text-blue-500">
                                                <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                                                    <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                            </div>
                                        )}
                                    </div>
                                </label>
                            </div>
                        </div>

                        <div className="space-y-5">
                            <div>
                                <label htmlFor="email" className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-zinc-500 mb-2">
                                    Email Address
                                </label>
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={form.email}
                                    onChange={handleInputChange}
                                    className="block w-full px-5 py-4 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all sm:text-sm shadow-sm"
                                    placeholder="name@company.com"
                                />
                                {errors.email && <p className="mt-2 text-xs font-bold text-red-500 uppercase tracking-tight">{errors.email}</p>}
                            </div>

                            <div>
                                <label htmlFor="password" className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-zinc-500 mb-2">
                                    Password
                                </label>
                                <input
                                    id="password"
                                    name="password"
                                    type="password"
                                    required
                                    value={form.password}
                                    onChange={handleInputChange}
                                    className="block w-full px-5 py-4 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all sm:text-sm shadow-sm"
                                    placeholder="••••••••"
                                />
                                {errors.password && <p className="mt-2 text-xs font-bold text-red-500 uppercase tracking-tight">{errors.password}</p>}
                            </div>
                        </div>

                        {authError && (
                            <div className="rounded-2xl bg-red-50 dark:bg-red-900/10 p-4 border border-red-100 dark:border-red-900/30">
                                <div className="flex">
                                    <div className="ml-3">
                                        <p className="text-xs font-bold text-red-800 dark:text-red-400 uppercase tracking-wide">
                                            {authError}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Authenticating...' : 'Sign In'}
                        </motion.button>

                        <div className="text-center">
                            <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">
                                New here?{' '}
                                <Link to="/register" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                                    Create account
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
