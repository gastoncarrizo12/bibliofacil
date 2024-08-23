// controllers/authController.js
const User = require('../models/user');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


exports.registerPage = (req, res) => {
    res.render('register');
};

exports.registerUser = async (req, res) => {
    const { username, email, password, password2} = req.body;
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
            const newUser = new User({ username, email, password});

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
    const { username, password } = req.body;

    try {
        // Buscar usuario por nombre de usuario
        const user = await User.findOne({ username });

        if (user && bcrypt.compareSync(password, user.password)) {
            // Generar el token JWT
            const token = jwt.sign(
                { id: user._id, role: user.role },
                process.env.JWT_SECRET || 'Unsta', // Es mejor utilizar una variable de entorno para la clave secreta
                { expiresIn: '1h' }
            );

            // Guardar el token en una cookie
            res.cookie('authToken', token, {
                httpOnly: true, 
                secure: process.env.NODE_ENV === 'production' // Solo utilizar 'secure' en producción
            });

            // Redirigir al usuario según su rol
            if (user.role === 'admin') {
                return res.redirect('admin/dashboard');
            } if(user.role === 'user') {
                return res.redirect('/');
            }
        } else {
            // Si las credenciales son incorrectas
            res.render('login', { error: 'Credenciales incorrectas' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send('Error en el servidor');
    }
};

exports.logoutUser = (req, res) => {
    res.clearCookie('authToken'); // Elimina la cookie del token
    res.redirect('/login');   // Redirige a la página de inicio de sesión
};

