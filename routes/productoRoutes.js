const express = require('express');
const ProductoController = require('../controller/productoController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// Rutas accesibles para todos los usuarios
router.get('/', ProductoController.getAllProducts);
router.get('/:id', ProductoController.getProductById);

// Rutas accesibles solo para administradores
router.post('/add', authMiddleware, adminMiddleware, ProductoController.addProduct);
router.get('/:id/delete', authMiddleware, adminMiddleware, ProductoController.deleteProduct);
router.get('/:id/edit', authMiddleware, adminMiddleware, ProductoController.showEditProduct);
router.post('/:id/edit', authMiddleware, adminMiddleware, ProductoController.editProduct);

module.exports = router;
