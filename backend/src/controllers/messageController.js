import Conversation from '../models/Conversation.js';
import Message from '../models/Message.js';
import {
  emitNewMessage,
  updateConversationAfterCreateMessage,
} from '../utils/messageHelper.js';
import { getIO } from '../libs/socket.js';

export const sendDirectMessage = async (req, res) => {
  try {
    const { recipientId, content, conversationId } = req.body;

    const senderId = req.user._id;

    let conversation;

    if (!content) {
      return res.status(400).json({ message: 'Thiếu nội dung tin nhắn' });
    }

    if (conversationId) {
      conversation = await Conversation.findById(conversationId);
    }

    if (!conversation) {
      conversation = await Conversation.create({
        type: 'direct',
        participants: [
          { userId: senderId, joinedAt: new Date() },
          { userId: recipientId, joinedAt: new Date() },
        ],
        lastMessage: new Date(),
        unreadCounts: new Map(),
      });
    }

    const message = await Message.create({
      conversationId: conversation._id,
      senderId,
      content,
    });

    updateConversationAfterCreateMessage(conversation, message, senderId);

    await conversation.save();

    emitNewMessage(getIO(), conversation, message);

    return res.status(201).json({ message });
  } catch (error) {
    console.error('Lỗi xảy ra khi gửi tin nhắn trực tiếp:', error);
    return res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const { conversationId, content } = req.body;
    const senderId = req.user._id;
    const conversation = req.conversation;

    if (!content) {
      return res.status(400).json({ message: 'Thiếu nội dung tin nhắn' });
    }

    const message = await Message.create({
      conversationId,
      senderId,
      content,
    });

    updateConversationAfterCreateMessage(conversation, message, senderId);

    await conversation.save();

    emitNewMessage(getIO(), conversation, message);

    return res.status(201).json({ message });
  } catch (error) {
    console.error('Lỗi xảy ra khi gửi tin nhắn nhóm:', error);
    return res.status(500).json({ message: 'Lỗi máy chủ' });
  }
};
