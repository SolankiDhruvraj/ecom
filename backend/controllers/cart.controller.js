import Cart from '../models/cart.models.js';
import Product from '../models/product.models.js';
import { addToCartSchema } from '../validators/cart.validator.js';

export const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = addToCartSchema.parse(req.body);

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        let cart = await Cart.findOne({ user: req.user._id });

        if (!cart) {
            cart = await Cart.create({
                user: req.user._id,
                items: [{ product: productId, quantity }],
            });
        } else {
            const itemIndex = cart.items.findIndex(
                (item) => item.product.toString() === productId
            );

            if (itemIndex > -1) {
                cart.items[itemIndex].quantity += quantity;
            } else {
                cart.items.push({ product: productId, quantity });
            }

            await cart.save();
        }

        res.status(200).json({ message: "Product added to cart", cart });
    } catch (err) {
        console.error('Add to cart error:', err);

        if (err.name === 'ZodError') {
            return res.status(400).json({ errors: err.errors });
        }

        if (err.name === 'CastError') {
            return res.status(400).json({ message: "Invalid product ID format" });
        }

        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const updateCartItemQuantity = async (req, res) => {
    try {
        const { productId, quantity } = addToCartSchema.parse(req.body);

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        if (quantity <= 0) {
            // Remove item if quantity is 0 or less
            cart.items.splice(itemIndex, 1);
        } else {
            cart.items[itemIndex].quantity = quantity;
        }

        await cart.save();
        res.status(200).json({ message: "Cart updated", cart });
    } catch (err) {
        console.error('Update quantity error:', err);

        if (err.name === 'ZodError') {
            return res.status(400).json({ errors: err.errors });
        }

        if (err.name === 'CastError') {
            return res.status(400).json({ message: "Invalid product ID format" });
        }

        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const removeCartItem = async (req, res) => {
    try {
        const { productId } = req.body;

        if (!productId) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === productId
        );

        if (itemIndex === -1) {
            return res.status(404).json({ message: "Item not found in cart" });
        }

        cart.items.splice(itemIndex, 1);
        await cart.save();

        res.status(200).json({ message: "Item removed from cart", cart });
    } catch (err) {
        console.error('Remove item error:', err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const getCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart) {
            return res.status(200).json({ items: [] });
        }

        const validItems = cart.items.filter(item => item.product !== null);
        const orphanedItems = cart.items.filter(item => item.product === null);

        if (orphanedItems.length > 0) {
            cart.items = validItems;
            await cart.save();
        }

        res.status(200).json(cart);
    } catch (err) {
        console.error('Get cart error:', err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};

export const clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ user: req.user._id });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        cart.items = [];
        await cart.save();

        res.status(200).json({ message: "Cart cleared successfully", cart });
    } catch (err) {
        console.error('Clear cart error:', err);
        res.status(500).json({ message: "Server error", error: err.message });
    }
};
