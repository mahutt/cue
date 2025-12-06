import { Response } from 'express';
import { AuthenticatedRequest } from '../controllers/types';
import express from 'express';

const router = express.Router();

/* GET home page. */
router.get('/', function (req: AuthenticatedRequest, res: Response) {
    if (!req.user) {
        return res.redirect('/login');
    }
    res.redirect(`/${req.user.name}`);
});

module.exports = router;
