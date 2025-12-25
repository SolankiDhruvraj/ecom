import Product from "../models/product.models.js";
import redisClient from "../config/redis.js";

const CACHE_KEY_PRODUCTS = 'products:all';
const CACHE_EXPIRATION = 3600; // 1 hour

// Get all products
export const getAllProducts = async (req, res) => {
    try {
        // Check cache first (ignore errors if Redis is down)
        let cachedProducts = null;
        try {
            if (redisClient.status === 'ready') {
                cachedProducts = await redisClient.get(CACHE_KEY_PRODUCTS);
            }
        } catch (err) {
            console.warn('Redis error (getAllProducts):', err.message);
        }

        if (cachedProducts) {
            console.log('Serving products from Redis cache');
            return res.status(200).json(JSON.parse(cachedProducts));
        }

        console.log('Fetching all products from DB...');
        const products = await Product.find({});
        console.log(`Found ${products.length} products`);

        // Save to cache (background task, don't wait/block)
        if (redisClient.status === 'ready') {
            redisClient.setex(CACHE_KEY_PRODUCTS, CACHE_EXPIRATION, JSON.stringify(products))
                .catch(err => console.warn('Redis set error:', err.message));
        }

        res.status(200).json(products);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ message: "Error fetching the products", error: error.message });
    }
};

// Get single product by ID
export const getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const cacheKey = `product:${id}`;

        // Check cache (ignore errors if Redis is down)
        let cachedProduct = null;
        try {
            if (redisClient.status === 'ready') {
                cachedProduct = await redisClient.get(cacheKey);
            }
        } catch (err) {
            console.warn('Redis error (getProductById):', err.message);
        }

        if (cachedProduct) {
            console.log(`Serving product ${id} from Redis cache`);
            return res.status(200).json(JSON.parse(cachedProduct));
        }

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Save to cache
        if (redisClient.status === 'ready') {
            redisClient.setex(cacheKey, CACHE_EXPIRATION, JSON.stringify(product))
                .catch(err => console.warn('Redis set error:', err.message));
        }

        res.status(200).json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        res.status(500).json({ message: "Error fetching the product", error: error.message });
    }
};

// Create new product (Admin only)
export const createProduct = async (req, res) => {
    try {
        const { name, description, price, brand, category, countInStock, image } = req.body;

        // Validate required fields
        if (!name || !description || !price || !brand || !category || countInStock === undefined) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const product = new Product({
            name,
            description,
            price,
            brand,
            category,
            countInStock,
            image: image || `https://via.placeholder.com/300x300?text=${encodeURIComponent(name)}`
        });

        const savedProduct = await product.save();

        // Invalidate all products cache
        redisClient.del(CACHE_KEY_PRODUCTS)
            .catch(err => console.warn('Redis del error:', err.message));
        console.log('Product created and cache invalidation triggered');

        res.status(201).json(savedProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ message: "Error creating product", error: error.message });
    }
};

// Update product (Admin only)
export const updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description, price, brand, category, countInStock, image } = req.body;

        const product = await Product.findById(id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Update fields
        product.name = name || product.name;
        product.description = description || product.description;
        product.price = price || product.price;
        product.brand = brand || product.brand;
        product.category = category || product.category;
        product.countInStock = countInStock !== undefined ? countInStock : product.countInStock;
        product.image = image || product.image;

        const updatedProduct = await product.save();

        // Invalidate caches
        Promise.all([
            redisClient.del(CACHE_KEY_PRODUCTS),
            redisClient.del(`product:${id}`)
        ]).catch(err => console.warn('Redis del error:', err.message));
        console.log(`Product ${id} updated and cache invalidation triggered`);

        res.status(200).json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ message: "Error updating product", error: error.message });
    }
};

// Delete product (Admin only)
export const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        console.log('Delete product request for ID:', id);

        const product = await Product.findById(id);
        if (!product) {
            console.log('Product not found for ID:', id);
            return res.status(404).json({ message: "Product not found" });
        }

        console.log('Found product to delete:', product.name);
        await Product.findByIdAndDelete(id);

        // Invalidate caches
        Promise.all([
            redisClient.del(CACHE_KEY_PRODUCTS),
            redisClient.del(`product:${id}`)
        ]).catch(err => console.warn('Redis del error:', err.message));
        console.log(`Product ${id} deleted and cache invalidation triggered`);

        res.status(200).json({ message: "Product deleted successfully" });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ message: "Error deleting product", error: error.message });
    }
};

// Default export for backward compatibility
const allProducts = getAllProducts;
export default allProducts;