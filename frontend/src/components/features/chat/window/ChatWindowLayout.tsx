import { useChatStore } from '@/stores/useChatStore';
import ChatWelcomeScreen from './ChatWelcomeScreen';
import { SidebarInset } from '@/components/ui/sidebar';
import ChatWindowHeader from './ChatWindowHeader';
import ChatWindowBody from './ChatWindowBody';
import ChatMessageInput from '../message/ChatMessageInput';
import { useEffect } from 'react';
import ChatWindowSkeleton from './ChatWindowSkeleton';

const ChatWindowLayout = () => {
  const {
    activeConversationId,
    conversations,
    messagesLoading: loading,
    markAsSeen,
  } = useChatStore();

  const selectedConvo =
    conversations.find((c) => c._id === activeConversationId) ?? null;

  useEffect(() => {
    if (!activeConversationId) {
      return;
    }

    const markAsSeenAsync = async () => {
      try {
        await markAsSeen();
      } catch (error) {
        console.error('Lỗi xảy ra khi markAsSeen:', error);
      }
    };

    markAsSeenAsync();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeConversationId]);

  if (!selectedConvo) {
    return <ChatWelcomeScreen />;
  }

  if (loading) {
    return <ChatWindowSkeleton />;
  }

  return (
    <SidebarInset className='flex flex-col h-full flex-1 overflow-hidden rounded-sm shadow-md'>
      {/* Header */}
      <ChatWindowHeader chat={selectedConvo} />

      {/* Body */}
      <div className='flex-1 overflow-y-auto bg-primary-foreground'>
        <ChatWindowBody />
      </div>

      {/* Footer */}
      <ChatMessageInput selectedConvo={selectedConvo} />
    </SidebarInset>
  );
};

export default ChatWindowLayout;
