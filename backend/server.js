import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import mongoSanitize from 'express-mongo-sanitize';
import { xssSanitizer } from './middleware/xss.middleware.js';
import { rateLimit } from 'express-rate-limit';
import DBConnect from './config/db.js';

import productsRoute from './routes/product.routes.js';
import authRoute from './routes/user.routes.js';
import cartRoute from './routes/cart.routes.js';
import checkoutRoute from './routes/checkout.routes.js';

dotenv.config();

const app = express();

app.use(cors({
    origin: process.env.NODE_ENV === 'production'
        ? process.env.CORS_ORIGIN
        : true,
    credentials: true,
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

app.use(
    helmet({
        xssFilter: false
    })
);
app.use(xssSanitizer);

app.use((req, res, next) => {
    if (["POST", "PUT", "PATCH", "DELETE"].includes(req.method) && req.body && Object.keys(req.body).length > 0) {
        try {
            req.body = mongoSanitize.sanitize(req.body);
        } catch (err) {
            return next(err);
        }
    }
    next();
});

app.use((req, res, next) => {
    if (req.body) {
        for (let key in req.body) {
            if (typeof req.body[key] === 'string') {
                req.body[key] = req.body[key].trim();
            }
        }
    }
    next();
});

const limiter = rateLimit({
    max: parseInt(process.env.RATE_LIMIT_MAX) || 100,
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000,
    message: 'Too many requests from this IP, please try again later!'
});
app.use('/v1/api', limiter);

const authLimiter = rateLimit({
    max: parseInt(process.env.AUTH_RATE_LIMIT_MAX) || 20,
    windowMs: parseInt(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 60 * 60 * 1000,
    message: 'Too many attempts from this IP, please try again later!'
});
app.use('/v1/api/auth', authLimiter);

DBConnect();

app.use('/v1/api/products', productsRoute);
app.use('/v1/api/auth', authRoute);
app.use('/v1/api/cart', cartRoute);
app.use('/v1/api/checkout', checkoutRoute);

app.get('/', (req, res) => {
    res.json({
        status: 'ok',
        message: 'E-commerce API is running',
        version: '1.0.0'
    });
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Something went wrong!' });
});

const PORT = 5001;
app.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
