import { useChatStore } from '@/stores/useChatStore';
import GroupChatCard from './GroupChatCard';

const GroupChatList = () => {
  const { conversations } = useChatStore();
  if (!conversations) return null;

  const groupChats = conversations.filter((convo) => convo.type === 'group');

  if (groupChats.length === 0) {
    return (
      <div className='p-4 text-center text-xs text-muted-foreground'>
        Chưa có nhóm chat nào
      </div>
    );
  }

  return (
    <div className='flex-1 overflow-y-auto p-2 space-y-2'>
      {groupChats.map((convo) => (
        <GroupChatCard convo={convo} key={convo._id}/>
      ))}
    </div>
  );
};

export default GroupChatList;
