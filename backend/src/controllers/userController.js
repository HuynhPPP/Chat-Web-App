import User from '../models/User.js';
import { uploadImageFromBuffer } from '../middlewares/uploadMiddleware.js';

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

export const uploadAvatar = async (req, res) => {
  try {
    const file = req.file;
    const userId = req.user._id;
    if (!file) {
      return res
        .status(400)
        .json({ message: 'Không tìm thấy file. Cần cung cấp file' });
    }
    const result = await uploadImageFromBuffer(file.buffer);
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        avatarUrl: result.secure_url,
        avatarId: result.public_id,
      },
      {
        new: true,
      }
    ).select('avatarUrl');

    if (!updatedUser.avatarUrl) {
      return res.status(400).json({ message: 'Avatar trả về null' });
    }
    return res.status(200).json({ avatarUrl: updatedUser.avatarUrl });
  } catch (error) {
    console.log('Lỗi khi upload avatar lên cloudinary:', error);
    return res.status(500).json({ message: 'Upload failed' });
  }
};
