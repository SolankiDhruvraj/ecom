import stripe from '../config/stripe.js';
import Cart from '../models/cart.models.js';
import Order from '../models/order.models.js';

export const createPaymentIntent = async (req, res) => {
    try {
        if (!stripe) {
            return res.status(503).json({
                success: false,
                message: "Payment processing is not available at the moment"
            });
        }

        console.log('Creating payment intent for user:', req.user._id);

        // Get user's cart
        const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');
        if (!cart || cart.items.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Cart is empty"
            });
        }

        // Calculate total amount
        const totalAmount = cart.items.reduce((total, item) => {
            return total + (item.quantity * (item.product?.price || 0));
        }, 0);

        // Convert to cents for Stripe
        const amountInCents = Math.round(totalAmount * 100);

        if (amountInCents <= 0) {
            return res.status(400).json({
                success: false,
                message: "Invalid amount"
            });
        }

        // Create payment intent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: amountInCents,
            currency: 'usd',
            automatic_payment_methods: {
                enabled: true,
            },
            metadata: {
                userId: req.user._id.toString(),
                cartId: cart._id.toString(),
            },
        });

        console.log('Payment intent created:', paymentIntent.id);

        res.status(200).json({
            success: true,
            clientSecret: paymentIntent.client_secret,
            amount: totalAmount,
            paymentIntentId: paymentIntent.id,
        });
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({
            success: false,
            message: "Error creating payment intent",
            error: error.message
        });
    }
};

export const confirmPayment = async (req, res) => {
    try {
        if (!stripe) {
            return res.status(503).json({
                success: false,
                message: "Payment processing is not available at the moment"
            });
        }

        const { paymentIntentId, cartId } = req.body;

        if (!paymentIntentId || !cartId) {
            return res.status(400).json({
                success: false,
                message: "Payment intent ID and cart ID are required"
            });
        }

        console.log('Confirming payment:', paymentIntentId);

        // Retrieve payment intent from Stripe
        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        if (paymentIntent.status !== 'succeeded') {
            return res.status(400).json({
                success: false,
                message: "Payment not completed"
            });
        }

        // Get cart and create order
        const cart = await Cart.findById(cartId).populate('items.product');
        if (!cart) {
            return res.status(404).json({
                success: false,
                message: "Cart not found"
            });
        }

        // Create order
        const order = await Order.create({
            user: req.user._id,
            orderItems: cart.items.map(item => ({
                product: item.product._id,
                name: item.product.name,
                qty: item.quantity,
                price: item.product.price,
                image: item.product.image
            })),
            totalPrice: cart.items.reduce((total, item) => total + (item.quantity * item.product.price), 0),
            paymentMethod: 'stripe',
            isPaid: true,
            paidAt: new Date(),
        });

        // Clear cart
        cart.items = [];
        await cart.save();

        console.log('Order created:', order._id);

        res.status(200).json({
            success: true,
            message: "Payment successful",
            orderId: order._id,
        });
    } catch (error) {
        console.error('Error confirming payment:', error);
        res.status(500).json({
            success: false,
            message: "Error confirming payment",
            error: error.message
        });
    }
};

export const getPaymentStatus = async (req, res) => {
    try {
        const { paymentIntentId } = req.params;

        if (!stripe) {
            return res.status(503).json({
                success: false,
                message: "Payment processing is not available at the moment"
            });
        }

        const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);

        res.status(200).json({
            success: true,
            status: paymentIntent.status,
            amount: paymentIntent.amount / 100,
        });
    } catch (error) {
        console.error('Error getting payment status:', error);
        res.status(500).json({
            success: false,
            message: "Error getting payment status",
            error: error.message
        });
    }
}; 