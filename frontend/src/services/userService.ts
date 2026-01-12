import api from '@/lib/axios';

export const userService = {
  uploadAvatar: async (formData: FormData) => {
    const res = await api.post('/user/uploadAvatar', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    if (res.status !== 200) {
      throw new Error(res.data.message);
    }
    return res.data;
  },
};
