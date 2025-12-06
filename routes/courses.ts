import express from 'express';
const router = express.Router();

// Require controller modules.
import courseController from '../controllers/courseController';

// Updating a course.
router.patch('/:id', courseController.update_course);

// deleting a course.
router.delete('/:id', courseController.delete_course);

export default router;
