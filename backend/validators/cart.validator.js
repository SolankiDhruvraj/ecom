import { z } from 'zod';

export const addToCartSchema = z.object({
    productId: z.string().min(1, "Product ID is required").refine(val => {
        // Check if it's a valid MongoDB ObjectId format
        return /^[0-9a-fA-F]{24}$/.test(val);
    }, "Invalid product ID format"),
    quantity: z.coerce.number().min(1, "Quantity must be at least 1").max(100, "Quantity cannot exceed 100").default(1)
});
