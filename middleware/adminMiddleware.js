function adminMiddleware(req, res, next) {
    if (req.user.role === 'admin') {
        next();
    } else {
        res.status(403).send('Acceso denegado: Se requiere rol de administrador.');
    }
}

module.exports = adminMiddleware;
