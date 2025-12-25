import express from 'express'
import { getAllProducts, getProductById, createProduct, updateProduct, deleteProduct } from '../controllers/product.controller.js'
import { protect } from '../middleware/auth.middleware.js'
import { admin } from '../middleware/admin.middleware.js'
import { validateProduct } from '../validators/product.validator.js'

const router = express.Router()

// Public routes
router.get('/', getAllProducts)
router.get('/:id', getProductById)

router.post('/', protect, admin, validateProduct, createProduct)
router.put('/:id', protect, admin, validateProduct, updateProduct)
router.delete('/:id', protect, admin, deleteProduct)

export default router