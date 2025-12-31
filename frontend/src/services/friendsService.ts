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
};
