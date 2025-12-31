import User from '../models/User.js';

export const authMe = async (req, res) => {
  try {
    const user = req.user; // lấy từ authMiddleware
    res.status(200).json({ user });
  } catch (error) {
    console.log('Lỗi khi gọi authMe:', error);
    return res.status(500).json({ message: 'Lỗi server' });
  }
};

export const searchUserByUsername = async (req, res) => {
  try {
    const { username } = req.query;

    if (!username || username.trim() === '') {
      return res.status(400).json({ message: 'Cần cung cấp username' });
    }

    const user = await User.findOne({ username }).select(
      '_id displayName username avatarUrl'
    );
    if (!user) {
      return res.status(404).json({ message: 'Không tìm thấy người dùng' });
    }
    res.status(200).json(user);
  } catch (error) {
    console.log('Lỗi khi tìm kiếm người dùng:', error);
    return res.status(500).json({ message: 'Lỗi hệ thống' });
  }
};
