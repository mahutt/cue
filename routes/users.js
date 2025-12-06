var express = require('express');
var router = express.Router();

// Require controller modules.
import authController from '../controllers/authController';
const user_controller = require('../controllers/userController');
import courseController from '../controllers/courseController';
const deck_controller = require('../controllers/deckController');

router.get('/api/users', user_controller.allUsers); // all users and all their info, authenticated
router.post('/api/users', user_controller.create_user); // create a new user
router.get('/api/users/all', user_controller.allUserNames); // just user names, unauthenticated
router.get('/api/users/:name/courses', courseController.getCoursesByUser);
router.delete('/users/:id', authController.authenticate, user_controller.delete_user);

module.exports = router;
