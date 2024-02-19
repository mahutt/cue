var express = require('express');
var router = express.Router();

const auth_controller = require('../controllers/authController');

/* GET home page. */
router.get('/', auth_controller.authenticate, function (req, res, next) {
    if (!req.user) {
        return res.redirect('/login');
    }
    res.redirect(`/${req.user.name}`);
});

module.exports = router;
