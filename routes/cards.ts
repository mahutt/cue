import express from 'express';
const router = express.Router();

// Require controller modules.
import CardController from '../controllers/cardController';

// Updating a card.
router.patch('/:id', CardController.update_card);

// Updating a card's score.
router.put('/:id', CardController.update_score);

// deleting a card.
router.delete('/:id', CardController.delete_card);

export default router;
