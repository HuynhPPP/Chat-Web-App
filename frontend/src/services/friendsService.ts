import api from '@/lib/axios';

export const friendService = {
  async searchUserByUsername(username: string) {
    const res = await api.get(`/user/search?username=${username}`);
    return res.data;
  },

  async sendFriendRequest(to: string, message?: string) {
    const res = await api.post('/friends/requests', { to, message });
    return res.data.message;
  },

  async getAllFriendRequests() {
    try {
      const res = await api.get('/friends/requests');
      const { sent, received } = res.data;
      return { sent, received };
    } catch (error) {
      console.log('Lỗi khi gửi get all friend requests', error);
    }
  },

  async acceptFriendRequest(requestId: string) {
    try {
      const res = await api.post(`/friends/requests/${requestId}/accept`);
      return res.data.requestAcceptedBy;
    } catch (error) {
      console.log('Lỗi khi gửi accept friend request', error);
    }
  },

  async declineFriendRequest(requestId: string) {
    try {
      await api.post(`/friends/requests/${requestId}/decline`);
    } catch (error) {
      console.log('Lỗi khi gửi decline friend request', error);
    }
  },

  async getFriendList() {
    try {
      const res = await api.get('/friends');
      return res.data.friends;
    } catch (error) {
      console.log('Lỗi khi gửi get friend list', error);
    }
  },
};
