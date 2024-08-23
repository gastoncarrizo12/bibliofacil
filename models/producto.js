const mongoose = require('mongoose');

// Definición del esquema de producto
const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,  // Campo obligatorio
        trim: true       // Elimina espacios en blanco al inicio y al final
    },
    price: {
        type: Number,
        required: true,  // Campo obligatorio
        min: 0           // No permite precios negativos
    },
    description: {
        type: String,
        required: true,  // Campo obligatorio
        trim: true       // Elimina espacios en blanco al inicio y al final
    },
    stock: {
        type: Number,
        required: true,  // Campo obligatorio
        min: 0           // No permite stock negativo
    },
    category: {
        type: String,
        required: true,  // Campo obligatorio
        enum: ['', '', '', '', '', 'Otros'] // Opciones de categoría
    },
    imageUrl: {
        type: String,
        required: false, // No obligatorio, por si no hay imagen
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now // Por defecto, la fecha actual
    }
});

// Crear el modelo basado en el esquema
const Product = mongoose.model('producto', productSchema);

module.exports = Product;
