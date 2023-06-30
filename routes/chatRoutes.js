import express from 'express';
import { allUsers, chat, getOwner } from '../controllers/chatController.js';

const router = express.Router()

router.post('/setavatar', chat);
router.get('/:id', getOwner);
router.get('/all/:id', allUsers);

export default router;