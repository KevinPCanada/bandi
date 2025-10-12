import express from 'express';
import { register, login, logout, createGuestUser } from '../controllers/auth.js';
import multer from 'multer';

const router = express.Router()
const upload = multer()

router.post('/register', upload.none(), register);
router.post('/login', upload.none(), login);
router.post('/logout', logout);
router.post('/guest', createGuestUser);

export default router