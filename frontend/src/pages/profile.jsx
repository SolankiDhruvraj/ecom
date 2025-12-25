import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../context/authContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { z } from 'zod';

const profileSchema = z.object({
    name: z.string().min(3, 'Name must be at least 3 characters'),
    email: z.string().email('Invalid email'),
    phone: z.string().min(10, 'Phone number must be at least 10 digits').optional(),
    address: z.object({
        street: z.string().min(3, 'Street must be at least 3 characters'),
        city: z.string().min(2, 'City must be at least 2 characters'),
        state: z.string().min(2, 'State must be at least 2 characters'),
        postalCode: z.string().regex(/^\d{5,6}$/, 'Postal code must be 5 or 6 digits'),
        country: z.string().min(2, 'Country must be at least 2 characters'),
    }),
});

export default function Profile() {
    const { user, updateUser } = useAuth();
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: '',
        email: '',
        phone: '',
        address: {
            street: '',
            city: '',
            state: '',
            postalCode: '',
            country: '',
        }
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        if (!user) {
            navigate('/login');
            return;
        }

        console.log('User data from context:', user);

        // Initialize form with user data from context
        setForm({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            address: {
                street: user.address?.street || '',
                city: user.address?.city || '',
                state: user.address?.state || '',
                postalCode: user.address?.postalCode || '',
                country: user.address?.country || '',
            }
        });

        // Load user profile data from backend
        loadProfile();
    }, [user, navigate]);

    const loadProfile = async () => {
        try {
            const response = await api.get('/auth/profile');
            const profileData = response.data;

            console.log('Profile data loaded:', profileData);

            setForm(prevForm => ({
                ...prevForm,
                name: profileData.name || prevForm.name,
                email: profileData.email || prevForm.email,
                phone: profileData.phone || prevForm.phone,
                address: {
                    street: profileData.address?.street || prevForm.address.street,
                    city: profileData.address?.city || prevForm.address.city,
                    state: profileData.address?.state || prevForm.address.state,
                    postalCode: profileData.address?.postalCode || prevForm.address.postalCode,
                    country: profileData.address?.country || prevForm.address.country,
                }
            }));
        } catch (error) {
            console.error('Error loading profile:', error);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;

        if (name.startsWith('address.')) {
            const addressField = name.split('.')[1];
            setForm(prev => ({
                ...prev,
                address: {
                    ...prev.address,
                    [addressField]: value
                }
            }));
        } else {
            setForm(prev => ({
                ...prev,
                [name]: value
            }));
        }

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});
        setSuccessMessage('');

        console.log('Submitting profile update:', form);

        try {
            profileSchema.parse(form);

            const response = await api.put('/auth/profile', form);

            if (response.status === 200) {
                setSuccessMessage('Profile updated successfully!');
                setIsEditing(false);

                // Update user context with new data
                if (updateUser) {
                    updateUser(response.data);
                }

                // Update local form state with the response data
                setForm(prevForm => ({
                    ...prevForm,
                    name: response.data.name || prevForm.name,
                    email: response.data.email || prevForm.email,
                    phone: response.data.phone || prevForm.phone,
                    address: {
                        street: response.data.address?.street || prevForm.address.street,
                        city: response.data.address?.city || prevForm.address.city,
                        state: response.data.address?.state || prevForm.address.state,
                        postalCode: response.data.address?.postalCode || prevForm.address.postalCode,
                        country: response.data.address?.country || prevForm.address.country,
                    }
                }));
            }
        } catch (error) {
            console.error('Profile update error:', error);
            console.error('Error response:', error.response?.data);

            if (error.name === 'ZodError') {
                const fieldErrors = {};
                error.errors.forEach(({ path, message }) => {
                    const fieldName = path.join('.');
                    fieldErrors[fieldName] = message;
                });
                setErrors(fieldErrors);
            } else if (error.response?.data?.message) {
                setErrors({ general: error.response.data.message });
            } else {
                setErrors({ general: 'Failed to update profile' });
            }
        } finally {
            setLoading(false);
        }
    };

    const isProfileComplete = () => {
        return form.name &&
            form.email &&
            form.address.street &&
            form.address.city &&
            form.address.state &&
            form.address.postalCode &&
            form.address.country;
    };

    if (!user) {
        return null;
    }

    return (
        <div className="min-h-screen bg-white dark:bg-zinc-950 py-12 transition-colors">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="bg-gray-50 dark:bg-zinc-900/50 border border-gray-100 dark:border-zinc-800 shadow-xl rounded-[2rem] overflow-hidden">
                    {/* Header */}
                    <div className="px-8 py-8 border-b border-gray-100 dark:border-zinc-800">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6">
                            <div>
                                <h1 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Your Profile</h1>
                                <p className="text-gray-500 dark:text-zinc-400 mt-1">
                                    Manage your identity and shipping preferences
                                </p>
                            </div>
                            <div className="flex items-center space-x-4">
                                {isProfileComplete() && (
                                    <div className="flex items-center bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 px-4 py-2 rounded-2xl">
                                        <svg className="h-5 w-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-xs font-bold uppercase tracking-widest">Verified</span>
                                    </div>
                                )}
                                {!isEditing ? (
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-2xl text-sm font-bold shadow-lg shadow-blue-500/20 active:scale-95 transition-all"
                                    >
                                        Edit Profile
                                    </button>
                                ) : (
                                    <button
                                        onClick={() => {
                                            setIsEditing(false);
                                            loadProfile();
                                        }}
                                        className="bg-gray-200 dark:bg-zinc-800 text-gray-700 dark:text-zinc-300 px-6 py-2.5 rounded-2xl text-sm font-bold hover:bg-gray-300 dark:hover:bg-zinc-700 active:scale-95 transition-all"
                                    >
                                        Cancel
                                    </button>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Success Message */}
                    {successMessage && (
                        <div className="mx-6 mt-4 rounded-md bg-green-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-green-800">{successMessage}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Error Message */}
                    {errors.general && (
                        <div className="mx-6 mt-4 rounded-md bg-red-50 p-4">
                            <div className="flex">
                                <div className="flex-shrink-0">
                                    <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                <div className="ml-3">
                                    <p className="text-sm font-medium text-red-800">{errors.general}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Profile Form */}
                    <form onSubmit={handleSubmit} className="px-8 py-8">
                        <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
                            {/* Personal Information */}
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center">
                                        <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-3 text-sm">1</span>
                                        Personal Information
                                    </h3>

                                    <div className="space-y-5">
                                        <div>
                                            <label htmlFor="name" className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-zinc-500 mb-2 text-left">
                                                Full Name
                                            </label>
                                            <input
                                                type="text"
                                                id="name"
                                                name="name"
                                                value={form.name}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className={`block w-full px-4 py-3 rounded-2xl transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none sm:text-sm ${isEditing
                                                    ? 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white'
                                                    : 'bg-gray-50/50 dark:bg-zinc-900/20 border border-transparent text-gray-500 dark:text-zinc-500 cursor-not-allowed'
                                                    }`}
                                            />
                                            {errors.name && <p className="mt-2 text-xs font-bold text-red-500 uppercase tracking-tight text-left">{errors.name}</p>}
                                        </div>

                                        <div>
                                            <label htmlFor="email" className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-zinc-500 mb-2 text-left">
                                                Email Address
                                            </label>
                                            <input
                                                id="email"
                                                name="email"
                                                type="email"
                                                value={form.email}
                                                disabled={true}
                                                className="block w-full px-4 py-3 rounded-2xl bg-gray-50/50 dark:bg-zinc-900/20 border border-transparent text-gray-400 dark:text-zinc-600 cursor-not-allowed sm:text-sm"
                                            />
                                            <p className="mt-2 text-[10px] font-bold text-gray-400 dark:text-zinc-600 uppercase tracking-wider text-left">Locked for security</p>
                                        </div>

                                        <div>
                                            <label htmlFor="phone" className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-zinc-500 mb-2 text-left">
                                                Phone Number
                                            </label>
                                            <input
                                                type="tel"
                                                id="phone"
                                                name="phone"
                                                value={form.phone}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className={`block w-full px-4 py-3 rounded-2xl transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none sm:text-sm ${isEditing
                                                    ? 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white'
                                                    : 'bg-gray-50/50 dark:bg-zinc-900/20 border border-transparent text-gray-500 dark:text-zinc-500 cursor-not-allowed'
                                                    }`}
                                                placeholder="+1 (555) 000-0000"
                                            />
                                            {errors.phone && <p className="mt-2 text-xs font-bold text-red-500 uppercase tracking-tight text-left">{errors.phone}</p>}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Shipping Address */}
                            <div className="space-y-8">
                                <div>
                                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 flex items-center text-left">
                                        <span className="w-8 h-8 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center mr-3 text-sm">2</span>
                                        Shipping Destination
                                    </h3>

                                    <div className="space-y-5">
                                        <div>
                                            <label htmlFor="street" className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-zinc-500 mb-2 text-left">
                                                Street Address
                                            </label>
                                            <input
                                                type="text"
                                                id="street"
                                                name="address.street"
                                                value={form.address.street}
                                                onChange={handleChange}
                                                disabled={!isEditing}
                                                className={`block w-full px-4 py-3 rounded-2xl transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none sm:text-sm ${isEditing
                                                    ? 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white'
                                                    : 'bg-gray-50/50 dark:bg-zinc-900/20 border border-transparent text-gray-500 dark:text-zinc-500 cursor-not-allowed'
                                                    }`}
                                            />
                                            {errors['address.street'] && <p className="mt-2 text-xs font-bold text-red-500 uppercase tracking-tight text-left">{errors['address.street']}</p>}
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="city" className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-zinc-500 mb-2 text-left">
                                                    City
                                                </label>
                                                <input
                                                    type="text"
                                                    id="city"
                                                    name="address.city"
                                                    value={form.address.city}
                                                    onChange={handleChange}
                                                    disabled={!isEditing}
                                                    className={`block w-full px-4 py-3 rounded-2xl transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none sm:text-sm ${isEditing
                                                        ? 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white'
                                                        : 'bg-gray-50/50 dark:bg-zinc-900/20 border border-transparent text-gray-500 dark:text-zinc-500 cursor-not-allowed'
                                                        }`}
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="state" className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-zinc-500 mb-2 text-left">
                                                    State
                                                </label>
                                                <input
                                                    type="text"
                                                    id="state"
                                                    name="address.state"
                                                    value={form.address.state}
                                                    onChange={handleChange}
                                                    disabled={!isEditing}
                                                    className={`block w-full px-4 py-3 rounded-2xl transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none sm:text-sm ${isEditing
                                                        ? 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white'
                                                        : 'bg-gray-50/50 dark:bg-zinc-900/20 border border-transparent text-gray-500 dark:text-zinc-500 cursor-not-allowed'
                                                        }`}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div>
                                                <label htmlFor="postalCode" className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-zinc-500 mb-2 text-left">
                                                    Postal Code
                                                </label>
                                                <input
                                                    type="text"
                                                    id="postalCode"
                                                    name="address.postalCode"
                                                    value={form.address.postalCode}
                                                    onChange={handleChange}
                                                    disabled={!isEditing}
                                                    className={`block w-full px-4 py-3 rounded-2xl transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none sm:text-sm ${isEditing
                                                        ? 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white'
                                                        : 'bg-gray-50/50 dark:bg-zinc-900/20 border border-transparent text-gray-500 dark:text-zinc-500 cursor-not-allowed'
                                                        }`}
                                                />
                                            </div>

                                            <div>
                                                <label htmlFor="country" className="block text-xs font-bold uppercase tracking-widest text-gray-500 dark:text-zinc-500 mb-2 text-left">
                                                    Country
                                                </label>
                                                <input
                                                    type="text"
                                                    id="country"
                                                    name="address.country"
                                                    value={form.address.country}
                                                    onChange={handleChange}
                                                    disabled={!isEditing}
                                                    className={`block w-full px-4 py-3 rounded-2xl transition-all focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 outline-none sm:text-sm ${isEditing
                                                        ? 'bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-800 text-gray-900 dark:text-white'
                                                        : 'bg-gray-50/50 dark:bg-zinc-900/20 border border-transparent text-gray-500 dark:text-zinc-500 cursor-not-allowed'
                                                        }`}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Submit Button */}
                        {isEditing && (
                            <div className="mt-12 flex justify-end">
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    disabled={loading}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-10 py-4 rounded-2xl text-sm font-bold shadow-xl shadow-blue-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                                >
                                    {loading ? 'Processing...' : 'Save Changes'}
                                </motion.button>
                            </div>
                        )}
                    </form>
                </div>
            </div>
        </div>
    );
} 