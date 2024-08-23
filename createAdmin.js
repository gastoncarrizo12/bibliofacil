const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/user');

mongoose.connect('mongodb://localhost:27017/login-app', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const createAdmin = async () => {
    const hashedPassword = bcrypt.hashSync('adminpassword', 10);  // Asegúrate de usar una contraseña segura
    const admin = new User({
        username: 'admin',
        password: hashedPassword,
        role: 'admin'
    });

    await admin.save();
    console.log('Admin creado exitosamente');
    mongoose.connection.close();
};

createAdmin();