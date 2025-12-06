import express from 'express';
const router = express.Router();

// Require controller modules.
import authController from '../controllers/authController';
import userController from '../controllers/userController';
import courseController from '../controllers/courseController';

router.get('/api/users', userController.allUsers); // all users and all their info, authenticated
router.post('/api/users', userController.create_user); // create a new user
router.get('/api/users/all', userController.allUserNames); // just user names, unauthenticated
router.get('/api/users/:name/courses', courseController.getCoursesByUser);
router.delete('/users/:id', authController.authenticate, userController.delete_user);

module.exports = router;
