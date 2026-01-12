import { userService } from '@/services/userService';
import type { UserState } from '@/types/store';
import { create } from 'zustand';
import { useAuthStore } from './useAuthStore';
import { useChatStore } from './useChatStore';

export const useUserStore = create<UserState>((set, get) => ({
  uploadAvatarUrl: async (formData: FormData) => {
    try {
      const { user, setUser } = useAuthStore.getState();
      const data = await userService.uploadAvatar(formData);

      if (user) {
        setUser({
          ...user,
          avatarUrl: data.avatarUrl,
        });
        useChatStore.getState().fetchConversations();
      }
      return { success: true };
    } catch (error: any) {
      console.error('Lỗi khi updateAvatarUrl', error);
      return {
        success: false,
        message:
          error?.response?.data?.message ||
          'Có lỗi xảy ra khi cập nhật ảnh đại diện',
      };
    }
  },
}));
