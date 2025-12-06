import express from 'express';
const router = express.Router();

// Require controller modules.
import authController from '../controllers/authController';

// Log in
router.post('/login', authController.login);

// Log out
router.post('/logout', authController.logout);

// Get logged in user
router.get('/user', authController.get_authenticated_user);

export default router;
