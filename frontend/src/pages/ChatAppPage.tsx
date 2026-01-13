import ChatWindowLayout from '@/components/features/chat/window/ChatWindowLayout';
import { AppSidebar } from '@/components/layout/sidebar/app-sidebar';
import { SidebarProvider } from '@/components/ui/sidebar';

const ChatAppPage = () => {
  return (
    <SidebarProvider>
      <AppSidebar />
      <div className='flex h-screen w-full p-2'>
        <ChatWindowLayout />
      </div>
    </SidebarProvider>
  );
};

export default ChatAppPage;
