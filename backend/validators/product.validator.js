export const validateProduct = (req, res, next) => {
    const { name, description, price, brand, category, countInStock } = req.body;

    const errors = [];

    if (!name || name.trim().length < 2) {
        errors.push('Product name must be at least 2 characters long');
    }

    if (!description || description.trim().length < 10) {
        errors.push('Product description must be at least 10 characters long');
    }

    if (!price || isNaN(price) || price <= 0) {
        errors.push('Price must be a positive number');
    }

    if (!brand || brand.trim().length < 1) {
        errors.push('Brand is required');
    }

    if (!category || category.trim().length < 1) {
        errors.push('Category is required');
    }

    if (countInStock === undefined || isNaN(countInStock) || countInStock < 0) {
        errors.push('Stock quantity must be a non-negative number');
    }

    if (errors.length > 0) {
        return res.status(400).json({
            message: 'Validation failed',
            errors
        });
    }

    next();
}; 