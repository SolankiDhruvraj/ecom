import React from 'react';
import { Routes, Route } from 'react-router-dom';
const Home = React.lazy(() => import('./pages/home'));
const Shop = React.lazy(() => import('./pages/shop'));
const Cart = React.lazy(() => import('./pages/cart'));
const Login = React.lazy(() => import('./pages/login'));
const Register = React.lazy(() => import('./pages/register'));
const ProductDetails = React.lazy(() => import('./pages/productDetails'));
const CheckoutSuccess = React.lazy(() => import('./pages/checkoutSuccess'));
const Admin = React.lazy(() => import('./pages/admin'));
const Profile = React.lazy(() => import('./pages/profile'));

import Header from './components/Header';
import Footer from './components/Footer';

function App() {
    return (
        <div className="flex flex-col min-h-screen bg-white dark:bg-zinc-950 text-gray-900 dark:text-zinc-100 transition-colors">
            <Header />
            <main className="flex-grow">
                <React.Suspense fallback={<div className="flex justify-center items-center h-full p-20">Loading...</div>}>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/shop" element={<Shop />} />
                        <Route path="/cart" element={<Cart />} />
                        <Route path="/product/:id" element={<ProductDetails />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/profile" element={<Profile />} />
                        <Route path="/checkout/success" element={<CheckoutSuccess />} />
                        <Route path="/admin" element={<Admin />} />
                    </Routes>
                </React.Suspense>
            </main>
            <Footer />
        </div>
    );
}

export default App;
