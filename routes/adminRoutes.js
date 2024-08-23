const express = require('express');
const AdminController = require('../controller/adminController');
const authMiddleware = require('../middleware/authMiddleware');
const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// Aplica los middlewares antes de las rutas de administración
router.use(authMiddleware, adminMiddleware);

router.get('/dashboard', AdminController.dashboard);
router.post('/product/add', AdminController.addProduct);
router.get('/product/:id/delete', AdminController.deleteProduct);
router.get('/product/:id/edit', AdminController.showEditProduct);
router.post('/product/:id/edit', AdminController.editProduct);

exports.dashboard = (req, res) => {
    res.render('/dashboard'); // Asegúrate de que la vista 'admin/dashboard' exista
};

module.exports = router;
