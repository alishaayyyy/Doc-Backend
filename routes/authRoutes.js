const express = require('express');
const router = express.Router();
// Ensure these functions exist in your controllers/authController.js
const { register, login } = require('../controllers/authController');

// Because this is mounted to '/api/auth' in server.js,
// these routes will be:
// POST /api/auth/register
// POST /api/auth/login
router.post('/register', register);
router.post('/login', login);

module.exports = router;