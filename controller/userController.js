const User = require('../models/user');

// controllers/userController.js
exports.dashboardPage = (req, res) => {
    // Puedes renderizar la página del dashboard sin verificar la sesión del usuario
    res.render('dashboard', { user: req.session.user || null });
};

exports.getDashboard = async (req, res) => {
    const user = await User.findById(req.session.userId);
    res.render('dashboard', { user });
};

exports.createUser = async (req, res) => {
    const newUser = new User(req.body);
    await newUser.save();
    res.redirect('/login');
};