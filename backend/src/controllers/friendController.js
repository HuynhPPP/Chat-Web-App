import Friend from '../models/Friend.js';
import User from '../models/User.js';
import FriendRequest from '../models/friendRequest.js';

export const sendFriendRequest = async (req, res) => {
  try {
    const { to, message } = req.body;
    const from = req.user.id;

    if (to === from) {
      return res
        .status(400)
        .json({ message: 'Bạn không thể gửi lời mời kết bạn cho chính mình' });
    }
    const userExists = await User.exists({ _id: to });
    if (!userExists) {
      return res.status(404).json({ message: 'Người dùng không tồn tại' });
    }

    let userA = from.toString();
    let userB = to.toString();

    if (userA > userB) {
      [userA, userB] = [userB, userA];
    }

    const [alreadyFriends, existingRequest] = await Promise.all([
      Friend.findOne({ userA, userB }),
      FriendRequest.findOne({
        $or: [
          { from, to },
          { from: to, to: from },
        ],
      }),
    ]);

    if (alreadyFriends) {
      return res
        .status(400)
        .json({ message: 'Bạn đã là bạn bè với người dùng này' });
    }

    if (existingRequest) {
      return res
        .status(400)
        .json({ message: 'Đã có lời mời kết bạn tồn tại giữa hai người dùng' });
    }

    const request = await FriendRequest.create({ from, to, message });
    res
      .status(201)
      .json({ message: 'Đã gửi lời mời kết bạn thành công', request });
  } catch (error) {
    console.error('Lỗi khi gửi yêu cầu kết bạn:', error);
    res.status(500).json({ message: 'Lỗi hệ thống' });
  }
};

export const acceptFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const request = await FriendRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Yêu cầu kết bạn không tồn tại' });
    }

    if (request.to.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: 'Bạn không có quyền chấp nhận lời mời này' });
    }

    const friend = await Friend.create({
      userA: request.from,
      userB: request.to,
    });

    await FriendRequest.findByIdAndDelete(requestId);

    const from = await User.findById(request.from)
      .select('_id displayName avatarUrl')
      .lean();

    res.status(200).json({
      message: 'Đã chấp nhận lời mời kết bạn',
      newFriend: {
        _id: from?._id,
        displayName: from?.displayName,
        avatarUrl: from?.avatarUrl,
      },
    });
  } catch (error) {
    console.error('Lỗi khi chấp nhận lời mời kết bạn:', error);
    res.status(500).json({ message: 'Lỗi hệ thống' });
  }
};

export const declineFriendRequest = async (req, res) => {
  try {
    const { requestId } = req.params;
    const userId = req.user._id;

    const request = await FriendRequest.findById(requestId);
    if (!request) {
      return res.status(404).json({ message: 'Yêu cầu kết bạn không tồn tại' });
    }

    if (request.to.toString() !== userId.toString()) {
      return res
        .status(403)
        .json({ message: 'Bạn không có quyền từ chối lời mời này' });
    }

    await FriendRequest.findByIdAndDelete(requestId);

    return res.status(200).json({ message: 'Đã từ chối lời mời kết bạn' });
  } catch (error) {
    console.error('Lỗi khi từ chối lời mời kết bạn:', error);
    res.status(500).json({ message: 'Lỗi hệ thống' });
  }
};

export const getAllFriends = async (req, res) => {
  try {
    const userId = req.user._id;

    const friends = await Friend.find({
      $or: [{ userA: userId }, { userB: userId }],
    })
      .populate('userA', '_id displayName avatarUrl username')
      .populate('userB', '_id displayName avatarUrl username')
      .lean();

    if (!friends.length) {
      return res.status(200).json({ friends: [] });
    }

    // lấy ra danh sách bạn bè
    const friendList = friends.map((f) =>
      f.userA._id.toString() === userId.toString() ? f.userB : f.userA
    );

    res.status(200).json({ friends: friendList });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách bạn bè:', error);
    res.status(500).json({ message: 'Lỗi hệ thống' });
  }
};

export const getFriendsRequest = async (req, res) => {
  try {
    const userId = req.user._id;

    const populateFields = '_id username displayName avatarUrl';

    const [sent, received] = await Promise.all([
      FriendRequest.find({ from: userId })
        .populate('to', populateFields)
        .lean(),
      FriendRequest.find({ to: userId })
        .populate('from', populateFields)
        .lean(),
    ]);

    res.status(200).json({ sent, received });
  } catch (error) {
    console.error('Lỗi khi lấy danh sách yêu cầu kết bạn:', error);
    res.status(500).json({ message: 'Lỗi hệ thống' });
  }
};
