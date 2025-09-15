import express from 'express';
const router = express.Router();

// Require controller modules.
import messageController from '../controllers/messageController';

router.get('/', messageController.allMessages);
router.post('/', messageController.createMessage);

export default router;
