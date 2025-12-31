import { useChatStore } from '@/stores/useChatStore';
import ChatWelcomeScreen from '../ChatWelcomeScreen';
import MessageItem from '../MessageItem';
import InfiniteScroll from 'react-infinite-scroll-component';
import { useEffect, useLayoutEffect, useRef, useState } from 'react';

const ChatWindowBody = () => {
  const {
    activeConversationId,
    conversations,
    messages: allMessages,
    fetchMessages,
  } = useChatStore();
  const [lastMessageStatus, setLastMessageStatus] = useState<
    'delivered' | 'seen'
  >('delivered');

  const messages = allMessages[activeConversationId!]?.items ?? [];
  const reversedMessages = [...messages].reverse();
  const hasMore = allMessages[activeConversationId!]?.hasMore ?? false;
  const selectedConvo = conversations.find(
    (c) => c._id === activeConversationId
  );
  const key = `chat-scroll-${activeConversationId}`;

  // ref
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const lastMessage = selectedConvo?.lastMessage;
    if (!lastMessage) {
      return;
    }

    const seenBy = selectedConvo?.seenBy ?? [];

    setLastMessageStatus(seenBy.length > 0 ? 'seen' : 'delivered');
  }, [selectedConvo]);

  // kéo xuống dưới khi load convo hoặc có tin nhắn mới
  useLayoutEffect(() => {
    if (!activeConversationId || !messages.length) return;
    messagesEndRef.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'end',
    });
  }, [activeConversationId, messages.length]);

  const fetchMoreMessages = async () => {
    if (!activeConversationId) return;

    try {
      await fetchMessages(activeConversationId);
    } catch (error) {
      console.error('Lỗi khi tải thêm tin nhắn:', error);
    }
  };

  const handleScrollSave = () => {
    const container = containerRef.current;
    if (!container) return;

    sessionStorage.setItem(
      key,
      JSON.stringify({
        scrollHeight: container.scrollHeight,
        scrollTop: container.scrollTop,
      })
    );
  };

  useLayoutEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const savedScroll = sessionStorage.getItem(key);
    if (savedScroll) {
      const { scrollTop } = JSON.parse(savedScroll);
      requestAnimationFrame(() => {
        container.scrollTop = scrollTop;
      });
    }
  }, [messages.length]);

  if (!selectedConvo) {
    return <ChatWelcomeScreen />;
  }

  if (!messages?.length) {
    return (
      <div className='flex h-full items-center justify-center text-muted-foreground'>
        Chưa có tin nhắn nào trong cuộc trò chuyện này.
      </div>
    );
  }

  return (
    <div className='p-4 bg-primary-foreground h-full flex flex-col overflow-hidden'>
      <div
        className='flex flex-col-reverse overflow-y-auto overflow-x-hidden beautiful-scrollbar'
        id='scrollableDiv'
        ref={containerRef}
        onScroll={handleScrollSave}
      >
        <div ref={messagesEndRef} />
        <InfiniteScroll
          dataLength={messages.length}
          next={() => {
            fetchMoreMessages();
          }}
          hasMore={hasMore}
          scrollableTarget='scrollableDiv'
          loader={<div>Đang tải...</div>}
          inverse={true}
          style={{
            display: 'flex',
            flexDirection: 'column-reverse',
            overflow: 'visible',
          }}
        ></InfiniteScroll>

        {reversedMessages.map((message, index) => (
          <>
            <MessageItem
              message={message}
              key={message._id ?? index}
              index={index}
              messages={reversedMessages}
              selectedConvo={selectedConvo}
              lastMessageStatus={lastMessageStatus}
            />
          </>
        ))}
      </div>
    </div>
  );
};

export default ChatWindowBody;
