const jwt = require('jsonwebtoken');
const User = require('../models/user');

const authMiddleware = async (req, res, next) => {
    try {
        // Obtén el token de las cookies
        const token = req.cookies.authToken;

        if (!token) {
            return res.status(401).json({ message: 'Token no proporcionado' });
        }

        // Verifica y decodifica el token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'Unsta');

        // Busca el usuario en la base de datos
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ message: 'Usuario no encontrado' });
        }

        // Guarda la información del usuario en `req`
        req.user = user;
        next();
    } catch (error) {
        console.error('Error en el middleware de autenticación:', error);
        res.status(401).json({ message: 'Token inválido o expirado' });
    }
};

module.exports = authMiddleware;
