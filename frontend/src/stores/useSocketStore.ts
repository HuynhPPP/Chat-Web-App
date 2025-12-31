import { create } from 'zustand';
import { io, type Socket } from 'socket.io-client';
import { useAuthStore } from './useAuthStore';
import type { SocketState } from '@/types/store';
import { useChatStore } from './useChatStore';
const baseURL = import.meta.env.VITE_SOCKET_URL;
export const useSocketStore = create<SocketState>((set, get) => ({
  socket: null,
  onlineUsers: [],

  connectSocket: () => {
    const accessToken = useAuthStore.getState().accessToken;
    const existingSocket = get().socket;

    console.log('🔌 Attempting to connect socket...', {
      baseURL,
      hasToken: !!accessToken,
    });

    if (existingSocket?.connected) {
      console.log('⚠️ Socket already connected, skipping...');
      return;
    }
    const socket: Socket = io(baseURL, {
      auth: {
        token: accessToken,
      },
      transports: ['websocket'],
    });

    socket.on('connect', () => {
      console.log('✅ Đã kết nối với server Socket');
    });

    // online users
    socket.on('online-Users', (userIds) => {
      set({ onlineUsers: userIds });
    });

    // new message
    socket.on('new-message', (data) => {
      const { message, conversation, unreadCounts } = data;
      useChatStore.getState().addMessage(message);

      const lastMessage = {
        _id: conversation.lastMessage._id,
        content: conversation.lastMessage.content,
        createdAt: conversation.lastMessage.createdAt,
        sender: {
          _id: conversation.lastMessage.senderId,
          displayName: '',
          avatar: null,
        },
      };

      const updatedConversation = {
        ...conversation,
        lastMessage,
        unreadCounts,
      };

      if (
        useChatStore.getState().activeConversationId === message.conversationId
      ) {
        // đánh dấu đã đọc
        useChatStore.getState().markAsSeen();
      }

      useChatStore.getState().updateConversation(updatedConversation);
    });

    // read message
    socket.on('read-message', ({ conversation, lastMessage }) => {
      const updated = {
        _id: conversation._id,
        lastMessage,
        lastMessageAt: conversation.lastMessageAt,
        unreadCounts: conversation.unreadCounts,
        seenBy: conversation.seenBy,
      };
      useChatStore.getState().updateConversation(updated);
    });

    socket.on('connect_error', (error) => {
      console.error('❌ Socket connection error:', error.message);
    });

    socket.on('disconnect', (reason) => {
      console.log('🔌 Đã ngắt kết nối với server Socket. Reason:', reason);
    });

    set({ socket });
  },
  disconnectSocket: () => {
    const socket = get().socket;
    if (!socket) return;
    socket.disconnect();
    set({ socket: null });
  },
}));
