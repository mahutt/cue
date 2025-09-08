var express = require('express');
var router = express.Router();

// Require controller modules.
const auth_controller = require('../controllers/authController');

// Log in
router.post('/login', auth_controller.login);

// Log out
router.post('/logout', auth_controller.logout);

// Get logged in user
router.get('/user', auth_controller.get_authenticated_user);

module.exports = router;
