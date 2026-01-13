'use client';

import * as React from 'react';

import { NavUser } from '@/components/layout/sidebar/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '@/components/ui/sidebar';
import { Moon, Sun } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import CreateNewChat from '@/components/features/chat/direct/CreateNewChat';
import NewGroupChatModal from '@/components/features/chat/group/NewGroupChatModal';
import GroupChatList from '@/components/features/chat/conversation/GroupChatList';
import AddFriendModal from '@/components/features/friend/AddFriendModal';
import DirectMessageList from '@/components/features/chat/conversation/DirectMessageList';
import { useThemeStore } from '@/stores/useThemeStore';
import { useAuthStore } from '@/stores/useAuthStore';
import { useChatStore } from '@/stores/useChatStore';
import ConversationSkeleton from '@/components/features/chat/conversation/ConversationSkeleton';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isDark, toggleTheme } = useThemeStore();
  const { user } = useAuthStore();
  const { convoloading } = useChatStore();

  return (
    <Sidebar variant='inset' {...props}>
      {/* Header */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              size='lg'
              asChild
              className='bg-gradient-primary'
            >
              <a href='#'>
                <div className='flex w-full items-center px-2 justify-between'>
                  <h1 className='text-xl font-bold text-white'>Chat-App</h1>
                  <div className='flex items-center gap-2'>
                    <Sun className='size-4 text-white/80' />
                    <Switch
                      checked={isDark}
                      onCheckedChange={toggleTheme}
                      className='data-[state=checked]:bg-background/80'
                    />
                    <Moon className='size-4 text-white/80' />
                  </div>
                </div>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className='beautiful-scrollbar'>
        {/* new chat */}
        <SidebarGroup>
          <SidebarGroupContent>
            <CreateNewChat />
          </SidebarGroupContent>
        </SidebarGroup>

        {/* group chat */}
        <SidebarGroup>
          <div className='flex items-center justify-between'>
            <SidebarGroupLabel className='uppercase'>
              Nhóm chat
            </SidebarGroupLabel>

            <NewGroupChatModal />
          </div>

          <SidebarGroupContent>
            {convoloading ? <ConversationSkeleton /> : <GroupChatList />}
          </SidebarGroupContent>
        </SidebarGroup>

        {/* direct message */}
        <SidebarGroup>
          <SidebarGroupLabel className='uppercase'>Bạn bè</SidebarGroupLabel>
          <SidebarGroupAction title='Kết Bạn' className='cursor-pointer'>
            <AddFriendModal />
          </SidebarGroupAction>

          <SidebarGroupContent>
            {convoloading ? <ConversationSkeleton /> : <DirectMessageList />}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter>{user && <NavUser user={user} />}</SidebarFooter>
    </Sidebar>
  );
}
