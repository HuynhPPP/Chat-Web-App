import jwt from 'jsonwebtoken';
import User from '../models/User.js';
export const socketMiddleware = async (socket, next) => {
  try {
    console.log('🔐 Socket middleware: Authenticating connection...');

    const token = socket.handshake.auth?.token;
    if (!token) {
      console.error('❌ Socket middleware: No token provided');
      return next(new Error('Unauthorized - Token không tồn tại'));
    }
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
    if (!decoded) {
      console.error('❌ Socket middleware: Invalid token');
      return next(
        new Error('Unauthorized - Token không hợp lệ hoặc đã hết hạn')
      );
    }
    const user = await User.findById(decoded.userId).select('-hashedPassword');
    if (!user) {
      console.error('❌ Socket middleware: User not found');
      return next(new Error('Unauthorized - User không tồn tại'));
    }
    console.log(`✅ Socket middleware: User ${user.displayName} authenticated`);
    socket.user = user;
    next();
  } catch (error) {
    console.error('❌ Socket middleware error:', error.message);
    next(new Error('Unauthorized'));
  }
};
