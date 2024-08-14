// routes/userRoutes.js
const express = require('express');
const userController = require('../controller/userController');

const router = express.Router();

router.get('/dashboard', userController.dashboardPage);

module.exports = router;

