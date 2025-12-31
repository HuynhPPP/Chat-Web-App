import mongoose from 'mongoose';

const friendRequestSchema = new mongoose.Schema(
  {
    from: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    to: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    message: {
      type: String,
      maxLenghth: 300,
    },
  },
  { timestamps: true }
);

friendRequestSchema.index({ from: 1, to: 1 }, { unique: true }); // đảm bảo không có yêu cầu kết bạn trùng lặp giữa hai người dùng

friendRequestSchema.index({ from: 1 }); // truy vấn nhanh tất cả lời mời kết bạn đã gửi
friendRequestSchema.index({ to: 1 }); // truy vấn nhanh tất cả lời mời kết bạn đã nhận

const FriendRequest = mongoose.model('FriendRequest', friendRequestSchema);

export default FriendRequest;
