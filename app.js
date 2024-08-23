// app.js
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const flash = require('connect-flash');
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const authMiddleware = require('./middleware/authMiddleware');
const path = require('path');
const productoRoutes = require('./routes/productoRoutes');
const adminMiddleware = require('./middleware/adminMiddleware');
const adminRoutes = require('./routes/adminRoutes');
const cookieParser = require('cookie-parser')

const app = express();

// Configuración de Mongoose
mongoose.connect('mongodb://localhost:27017/login-app')
    .then(() => console.log('Conectado a MongoDB'))
    .catch(err => console.error('Error al conectar a MongoDB:', err));


// Middleware
app.use(cookieParser()); // Configura cookie-parser antes de usar cookies
app.use(bodyParser.urlencoded({ extended: false }));
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
}));
app.use(flash());

// Configuración de vistas (usando EJS)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Archivos estáticos (CSS, JS, imágenes)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware para mensajes flash
app.use((req, res, next) => {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    next();
});

// Ruta principal
app.get('/', (req, res) => {
    res.render('index');  // Redirige a la lista de productos
});


// Rutas públicas (accesibles para todos)
app.use('/product', productoRoutes);

// Rutas protegidas (solo accesibles para administradores)
app.use('/admin', authMiddleware, adminMiddleware, adminRoutes);



// Rutas
app.use(authRoutes);
app.use('/user', userRoutes);

// Manejo de rutas no encontradas (404)
app.use((req, res, next) => {
    res.status(404).render('404', { message: 'Página no encontrada' });
});

// Manejo de errores
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Error en el servidor');
});


// Iniciar el servidor
app.listen(3000, () => {
    console.log('Servidor iniciado en http://localhost:3000');
});
