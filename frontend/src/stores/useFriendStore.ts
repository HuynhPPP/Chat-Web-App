import { friendService } from '@/services/friendsService';
import type { FriendState } from '@/types/store';
import { toast } from 'sonner';
import { create } from 'zustand';

export const useFriendStore = create<FriendState>((set) => ({
  friends: [],
  loading: false,
  receivedList: [],
  sentList: [],
  searchByUsername: async (username) => {
    try {
      set({ loading: true });
      const user = await friendService.searchUserByUsername(username);
      return user;
    } catch (error) {
      console.error('Lỗi xảy ra khi tìm kiếm người dùng:', error);
      return null;
    } finally {
      set({ loading: false });
    }
  },
  addFriend: async (to, message) => {
    try {
      set({ loading: true });
      const resultMessage = await friendService.sendFriendRequest(to, message);
      return resultMessage;
    } catch (error: any) {
      console.error('Lỗi xảy ra khi gửi yêu cầu kết bạn:', error);

      // Extract error message from backend response if available
      const errorMessage =
        error?.response?.data?.message ||
        'Lỗi xảy ra khi gửi yêu cầu kết bạn. Vui lòng thử lại sau.';

      toast.error(errorMessage);
      throw new Error(errorMessage);
    } finally {
      set({ loading: false });
    }
  },
  getAllFriendRequests: async () => {
    try {
      set({ loading: true });
      const result = await friendService.getAllFriendRequests();

      if (!result) return;

      const { received, sent } = result;

      set({ receivedList: received, sentList: sent });
    } catch (error) {
      console.error('Lỗi xảy ra khi getAllFriendRequests', error);
    } finally {
      set({ loading: false });
    }
  },
  acceptFriendRequest: async (requestId) => {
    try {
      set({ loading: true });
      await friendService.acceptFriendRequest(requestId);

      set((state) => ({
        receivedList: state.receivedList.filter(
          (request) => request._id !== requestId
        ),
      }));
    } catch (error) {
      console.error('Lỗi xảy ra khi acceptFriendRequest:', error);
    } finally {
      set({ loading: false });
    }
  },
  declineFriendRequest: async (requestId) => {
    try {
      set({ loading: true });
      await friendService.declineFriendRequest(requestId);

      set((state) => ({
        receivedList: state.receivedList.filter(
          (request) => request._id !== requestId
        ),
      }));
    } catch (error) {
      console.error('Lỗi xảy ra khi declineFriendRequest:', error);
    } finally {
      set({ loading: false });
    }
  },
  getFriends: async () => {
    try {
      set({ loading: true });
      const friends = await friendService.getFriendList();
      if (!friends) return;

      set({ friends: friends });
    } catch (error) {
      console.error('Lỗi xảy ra khi getFriends', error);
      set({ friends: [] });
    } finally {
      set({ loading: false });
    }
  },
}));
