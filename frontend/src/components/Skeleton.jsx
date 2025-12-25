import React from 'react';
import { motion } from 'framer-motion';

const Skeleton = ({ className }) => {
    return (
        <div className={`relative overflow-hidden bg-gray-200 dark:bg-zinc-800 rounded-xl ${className}`}>
            <motion.div
                initial={{ x: '-100%' }}
                animate={{ x: '100%' }}
                transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 dark:via-white/5 to-transparent"
            />
        </div>
    );
};

export const ProductSkeleton = () => {
    return (
        <div className="bg-white dark:bg-zinc-900 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-zinc-800 h-full flex flex-col">
            <Skeleton className="w-full aspect-square rounded-xl mb-4" />
            <Skeleton className="h-6 w-3/4 mb-2" />
            <Skeleton className="h-4 w-1/2 mb-4" />
            <div className="flex justify-between items-center mt-auto">
                <Skeleton className="h-6 w-1/4" />
                <Skeleton className="h-10 w-1/3 rounded-lg" />
            </div>
        </div>
    );
};

export default Skeleton;
