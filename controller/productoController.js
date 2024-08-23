const Product = require('../models/producto');

// Muestra todos los productos para los usuarios de compra
exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.find();
        res.render('products/list', { products });
    } catch (error) {
        res.status(500).send('Error al cargar los productos.');
    }
};

// Muestra un producto específico para los usuarios de compra
exports.getProductById = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).send('Producto no encontrado.');
        }

        res.render('products/detail', { product });
    } catch (error) {
        res.status(500).send('Error al cargar el producto.');
    }
};

// Añade un nuevo producto (Solo Administradores)
exports.addProduct = async (req, res) => {
    try {
        const { name, price, description, stock } = req.body;
        const newProduct = new Product({ name, price, description, stock });

        await newProduct.save();
        res.redirect('/admin');  // Redirige al dashboard del admin
    } catch (error) {
        res.status(500).send('Error al añadir el producto.');
    }
};

// Elimina un producto (Solo Administradores)
exports.deleteProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        await Product.findByIdAndDelete(productId);

        res.redirect('/admin');  // Redirige al dashboard del admin
    } catch (error) {
        res.status(500).send('Error al eliminar el producto.');
    }
};

// Edita un producto existente (Solo Administradores)
exports.editProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const { name, price, description, stock } = req.body;

        await Product.findByIdAndUpdate(productId, { name, price, description, stock });
        res.redirect('/admin');  // Redirige al dashboard del admin
    } catch (error) {
        res.status(500).send('Error al editar el producto.');
    }
};

// Muestra la vista para editar un producto específico (Solo Administradores)
exports.showEditProduct = async (req, res) => {
    try {
        const productId = req.params.id;
        const product = await Product.findById(productId);

        res.render('admin/editProduct', { product });
    } catch (error) {
        res.status(500).send('Error al cargar el producto.');
    }
};
