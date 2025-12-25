import React, { useState } from 'react';
import api from '../services/api';
import { z } from 'zod';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { User as UserIcon } from 'lucide-react';

const registerSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().email('Invalid email'),
    password: z.string().min(6, 'Password must be at least 6 characters'),
    userType: z.enum(['user', 'admin'], { required_error: 'Please select user type' }),
});

export default function Register() {
    const [form, setForm] = useState({
        name: '',
        email: '',
        password: '',
        userType: 'user'
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setServerError('');
        setLoading(true);
        try {
            registerSchema.parse(form);
            const res = await api.post('/auth/register', form);
            if (res.status === 201) {
                navigate('/login', {
                    state: {
                        message: 'Registration successful! Please log in.',
                        userType: form.userType
                    }
                });
            } else if (res.data && res.data.message) {
                setServerError(res.data.message);
            } else {
                setServerError('Registration failed');
            }
        } catch (err) {
            if (err.name === 'ZodError') {
                const fieldErrors = {};
                err.errors.forEach(({ path, message }) => {
                    fieldErrors[path[0]] = message;
                });
                setErrors(fieldErrors);
            } else if (err.response && err.response.data) {
                if (err.response.data.errors) {
                    // Backend Zod validation errors
                    const fieldErrors = {};
                    err.response.data.errors.forEach(({ path, message }) => {
                        fieldErrors[path[0]] = message;
                    });
                    setErrors(fieldErrors);
                } else if (err.response.data.message) {
                    setServerError(err.response.data.message);
                } else {
                    setServerError('Registration failed');
                }
            } else {
                setServerError('Registration failed');
            }
        } finally {
            setLoading(false);
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
                    Join Us Today
                </h2>
                <p className="mt-3 text-gray-500 dark:text-zinc-400 font-medium tracking-tight">
                    Create your premium shopping profile
                </p>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-gray-50/50 dark:bg-zinc-900/50 backdrop-blur-xl border border-gray-100 dark:border-zinc-800 py-10 px-8 shadow-2xl rounded-[2.5rem] sm:px-12">
                    <form onSubmit={handleSubmit} className="space-y-8 text-left">
                        {/* User Type Selection */}
                        <div>
                            <label className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-zinc-500 mb-4 ">
                                I want to register as:
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
                                        onChange={handleChange}
                                        className="sr-only"
                                    />
                                    <div className="w-full">
                                        <div className="text-sm font-black text-gray-900 dark:text-white text-left">Customer</div>
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
                                        onChange={handleChange}
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
                                <label htmlFor="name" className="block text-xs font-black uppercase tracking-widest text-gray-500 dark:text-zinc-500 mb-2">
                                    Full Name
                                </label>
                                <input
                                    id="name"
                                    name="name"
                                    type="text"
                                    required
                                    value={form.name}
                                    onChange={handleChange}
                                    className="block w-full px-5 py-4 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all sm:text-sm shadow-sm"
                                    placeholder="John Doe"
                                />
                                {errors.name && <p className="mt-2 text-xs font-bold text-red-500 uppercase tracking-tight">{errors.name}</p>}
                            </div>

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
                                    onChange={handleChange}
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
                                    onChange={handleChange}
                                    className="block w-full px-5 py-4 border border-gray-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-gray-900 dark:text-white rounded-2xl focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all sm:text-sm shadow-sm"
                                    placeholder="••••••••"
                                />
                                {errors.password && <p className="mt-2 text-xs font-bold text-red-500 uppercase tracking-tight">{errors.password}</p>}
                            </div>
                        </div>

                        {serverError && (
                            <div className="rounded-2xl bg-red-50 dark:bg-red-900/10 p-4 border border-red-100 dark:border-red-900/30">
                                <p className="text-xs font-bold text-red-800 dark:text-red-400 uppercase tracking-wide">
                                    {serverError}
                                </p>
                            </div>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full flex justify-center py-4 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-black uppercase tracking-widest rounded-2xl shadow-xl shadow-blue-500/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating account...' : 'Create Account'}
                        </motion.button>

                        <div className="text-center">
                            <p className="text-sm font-medium text-gray-500 dark:text-zinc-400">
                                Already have an account?{' '}
                                <Link to="/login" className="text-blue-600 dark:text-blue-400 font-bold hover:underline">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
