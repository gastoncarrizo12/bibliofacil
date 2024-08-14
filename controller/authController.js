// controllers/authController.js
const User = require('../models/user');
const bcrypt = require('bcryptjs');

exports.registerPage = (req, res) => {
    res.render('register');
};

exports.registerUser = async (req, res) => {
    const { username, email, password, password2 } = req.body;
    let errors = [];

    if (!username || !email || !password || !password2) {
        errors.push({ msg: 'Por favor complete todos los campos' });
    }

    if (password !== password2) {
        errors.push({ msg: 'Las contraseñas no coinciden' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'La contraseña debe tener al menos 6 caracteres' });
    }

    if (errors.length > 0) {
        res.render('register', { errors, username, email, password, password2 });
    } else {
        const user = await User.findOne({ email });

        if (user) {
            errors.push({ msg: 'El correo electrónico ya está registrado' });
            res.render('register', { errors, username, email, password, password2 });
        } else {
            const newUser = new User({ username, email, password });

            // Encriptar la contraseña
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => {
                            req.flash('success_msg', '¡Estás registrado y ahora puedes iniciar sesión!');
                            res.redirect('/login');
                        })
                        .catch(err => console.log(err));
                });
            });
        }
    }
};

exports.loginPage = (req, res) => {
    res.render('login');
};

exports.loginUser = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        req.flash('error_msg', 'Usuario no encontrado');
        return res.redirect('/login');
    }

    bcrypt.compare(password, user.password, (err, isMatch) => {
        if (err) throw err;

        if (isMatch) {
            req.session.user = user;
            res.redirect('/dashboard');
        } else {
            req.flash('error_msg', 'Contraseña incorrecta');
            res.redirect('/login');
        }
    });
};

exports.logoutUser = (req, res) => {
    req.session.destroy();
    res.redirect('/login');
};
