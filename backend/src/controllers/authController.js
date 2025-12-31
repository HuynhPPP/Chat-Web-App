import bcrypt from "bcrypt";
import User from "../models/User.js";
import Session from "../models/Session.js";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const ACCESS_TOKEN_TTL = "30m";
const REFRESH_TOKEN_TTL = 14 * 24 * 60 * 60 * 1000; // 14 ngày

export const signUp = async (req, res) => {
  try {
    const { username, password, email, firstName, lastName } = req.body;

    if (!username || !password || !email || !firstName || !lastName) {
      return res.status(400).json({
        message:
          "Không thể thiếu username, password, email, firstName và lastName",
      });
    }

    // kiểm tra username tồn tại chưa
    const duplicatedUsername = await User.findOne({ username });
    if (duplicatedUsername) {
      return res.status(409).json({
        message: "Username đã tồn tại",
      });
    }

    // mã hoá password
    const hashedPassword = await bcrypt.hash(password, 10);
    if (!hashedPassword) {
      return res.status(500).json({
        message: "Lỗi mã hoá password",
      });
    }

    // tạo user mới
    const newUser = await User.create({
      username,
      hashedPassword,
      email,
      displayName: `${lastName} ${firstName}`,
    });
    if (!newUser) {
      return res.status(500).json({
        message: "Failed to create user",
      });
    }

    // return
    return res.sendStatus(204);
  } catch (error) {
    console.log("Lỗi khi gọi signUp:", error);
    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

export const signIn = async (req, res) => {
  try {
    // Lấy inputs
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({
        message: "Thiếu username hoặc password!",
      });
    }

    // Lấy hashed password từ database so với password input
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        message: "Username hoặc password không đúng!",
      });
    }

    // Kiểm tra password
    const passwordCorrect = await bcrypt.compare(password, user.hashedPassword);

    if (!passwordCorrect) {
      return res.status(401).json({
        message: "Username hoặc password không đúng!",
      });
    }

    // Nếu khớp, tạo access token với JWT
    const accessToken = jwt.sign(
      { userId: user._id },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );
    if (!accessToken) {
      return res.status(500).json({
        message: "Lỗi tạo access token",
      });
    }

    // Tạo refresh token
    const refreshToken = crypto.randomBytes(64).toString("hex");
    if (!refreshToken) {
      return res.status(500).json({
        message: "Lỗi tạo refresh token",
      });
    }

    // Tạo session mới để lưu refresh token
    const session = await Session.create({
      userId: user._id,
      refreshToken,
      expiresAt: new Date(Date.now() + REFRESH_TOKEN_TTL),
    });
    if (!session) {
      return res.status(500).json({
        message: "Lỗi tạo session",
      });
    }

    // Trả refresh token về trong cookie
    const refreshTokenCookie = res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: "true",
      sameSite: "none", // backend, frontend deploy riêng
      maxAge: REFRESH_TOKEN_TTL,
    });
    if (!refreshTokenCookie) {
      return res.status(500).json({
        message: "Lỗi tạo refresh token cookie",
      });
    }

    // Trả access token về trong res
    return res.json({
      message: `User ${user.displayName} đã đăng nhập thành công!`,
      accessToken,
    });
  } catch (error) {
    console.log("Lỗi khi gọi signIn:", error);
    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

export const signOut = async (req, res) => {
  try {
    // Lấy refresh token từ cookie
    const token = req.cookies?.refreshToken;

    if (token) {
      // Xoá refresh token trong session
      const session = await Session.findOneAndDelete({ refreshToken: token });
      if (!session) {
        return res.status(401).json({
          message: "Không tìm thấy session!",
        });
      }
      // Xoá cookie
      res.clearCookie("refreshToken");
    }
    return res.sendStatus(204);
  } catch (error) {
    console.log("Lỗi khi gọi signOut:", error);
    return res.status(500).json({
      message: "Lỗi hệ thống",
    });
  }
};

export const refreshToken = async (req, res) => {
  try {
    // lấy refresh token từ cookie
    const token = req.cookies?.refreshToken;
    if (!token) {
      return res.status(401).json({ message: "Token không tồn tại." });
    }

    // so với refresh token trong db
    const session = await Session.findOne({ refreshToken: token });
    if (!session) {
      return res
        .status(403)
        .json({ message: "Token không hợp lệ hoặc đã hết hạn" });
    }

    // kiểm tra hết hạn chưa
    if (session.expiresAt < new Date()) {
      return res.status(403).json({ message: "Token đã hết hạn." });
    }

    // tạo access token mới
    const accessToken = jwt.sign(
      {
        userId: session.userId,
      },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: ACCESS_TOKEN_TTL }
    );

    // return
    return res.status(200).json({ accessToken });
  } catch (error) {
    console.error("Lỗi khi gọi refreshToken", error);
    return res.status(500).json({ message: "Lỗi hệ thống" });
  }
};
