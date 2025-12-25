import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
    return (
        <footer className="bg-gray-900 text-gray-300 mt-8">
            <div className="max-w-7xl mx-auto px-6 py-8 grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                    <h3 className="text-lg font-semibold mb-2">About Us</h3>
                    <p className="text-sm">
                        We are a modern e-commerce platform offering high-quality products at affordable prices. Shop with confidence.
                    </p>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Quick Links</h3>
                    <ul className="space-y-1 text-sm">
                        <li><Link to="/" className="hover:underline">Home</Link></li>
                        <li><Link to="/shop" className="hover:underline">Shop</Link></li>
                        <li><Link to="/cart" className="hover:underline">Cart</Link></li>
                        <li><Link to="/login" className="hover:underline">Login</Link></li>
                    </ul>
                </div>

                <div>
                    <h3 className="text-lg font-semibold mb-2">Contact</h3>
                    <ul className="text-sm space-y-1">
                        <li>Email: support@ecomsite.com</li>
                        <li>Phone: +1234567891</li>
                        <li>Address: 123 Market Street, India</li>
                    </ul>
                </div>
            </div>

            <div className="bg-gray-800 text-center py-4 text-sm text-gray-400">
                &copy; {new Date().getFullYear()} EcomSite. All rights reserved.
            </div>
        </footer>
    );
}
