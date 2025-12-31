import express from 'express';
import {
  sendDirectMessage,
  sendGroupMessage,
} from '../controllers/messageController.js';
import {
  checkConversationMembership,
  checkFriendship,
} from '../middlewares/friendMiddleware.js';

const router = express.Router();

router.post('/direct', checkFriendship, sendDirectMessage);
router.post('/group', checkConversationMembership, sendGroupMessage);

export default router;
