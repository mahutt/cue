var express = require('express');
var router = express.Router();
const auth_controller = require('../controllers/authController');

router.post('/signup', auth_controller.register);
router.post('/login', auth_controller.login);
router.post('/logout', auth_controller.logout);
router.get('/current-user', auth_controller.authenticate, auth_controller.getCurrentUser);

module.exports = router;
