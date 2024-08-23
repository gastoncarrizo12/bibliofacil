const Product = require('../models/producto');
const User = require('../models/user');
//const Order = require('../models/Order');

// Muestra el dashboard del administrador
exports.dashboard = async (req, res) => {
    try {
        const products = await Product.find();  // Obtener todos los productos
        //const orders = await Order.find().populate('user').populate('product');  // Obtener todas las órdenes con detalles del usuario y producto
        const users = await User.find({ role: 'user' });  // Obtener todos los usuarios compradores

        res.render('admin/dashboard', { products, users });
    } catch (error) {
        res.status(500).send('Error al cargar el dashboard.');
    }
};

// Añade un nuevo producto
exports.addProduct = async (req, res) => {
    try {
        const { name, price, description, stock } = req.body;
        const newProduct = new Product({ name, price, description, stock });

        await newProduct.save();
        res.redirect('admin/dashboard');  // Redirige al dashboard del admin
    } catch (error) {
        res.status(500).send('Error al añadir el producto.');
    }
};

// Elimina un producto
exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        await Product.findByIdAndDelete(productId);

        res.redirect('admin/dashboard');  // Redirige al dashboard del admin
    } catch (error) {
        res.status(500).send('Error al eliminar el producto.');
    }
};

// Edita un producto existente
exports.editProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, price, description, stock } = req.body;

        await Product.findByIdAndUpdate(productId, { name, price, description, stock });
        res.redirect('admin/dashboard');  // Redirige al dashboard del admin
    } catch (error) {
        res.status(500).send('Error al editar el producto.');
    }
};

// Muestra la vista para editar un producto específico
exports.showEditProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);

        res.render('admin/editProduct', { product });
    } catch (error) {
        res.status(500).send('Error al cargar el producto.');
    }
};
