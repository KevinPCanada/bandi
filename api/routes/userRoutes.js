import express from 'express';
const router = express.Router();
import { deleteUser } from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

// `protect` middleware ensures only a logged-in user can delete their own account.
router.route('/profile').delete(protect, deleteUser);

export default router;
