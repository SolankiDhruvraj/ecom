import express from 'express';
import { addToCart, getCart, updateCartItemQuantity, removeCartItem, clearCart } from '../controllers/cart.controller.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

router.post('/addToCart', protect, addToCart);
router.get('/', protect, getCart);
router.put('/updateQuantity', protect, updateCartItemQuantity);
router.delete('/removeItem', protect, removeCartItem);
router.delete('/clearCart', protect, clearCart);

export default router;
