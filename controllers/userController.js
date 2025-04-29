const { User, UserLikedSong, UserLikedPlaylist, UserFollowedArtist, Song, Playlist, Artist, UserDownloadedSong } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { EmailOtp } = require("../models");
const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);
const streamifier = require("streamifier");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const JWT_SECRET = process.env.JWT_SECRET;

// Đăng ký tài khoản
exports.register = async (req, res) => {
  const { name, email, password, phone } = req.body;

  try {
    const existing = await User.findOne({ where: { email } });
    if (existing) {
      return res.status(400).json({ error: "Email đã tồn tại" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword, phone, avatar: "/avatars/avatar.jpg" });

    res.status(201).json({
      message: "Tạo tài khoản thành công",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Đăng nhập và trả token
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ where: { email } });
    if (!user) return res.status(401).json({ error: "Sai email hoặc mật khẩu" });

    if (user.provider === "google") {
      return res.status(400).json({ error: "Tài khoản này đăng nhập bằng Google. Vui lòng sử dụng Google Login." });
    }

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: "Sai email hoặc mật khẩu" });

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Đăng nhập thành công",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      },
    });
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
};


// Lấy thông tin profile người dùng
exports.getProfile = async (req, res) => {
  try {
    const { id, email } = req.user;
    const user = await User.findOne({ where: { id, email } });

    if (!user) return res.status(404).json({ error: "Không tìm thấy người dùng" });

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      avatar: user.avatar,
    });
  } catch (err) {
    res.status(500).json({ error: "Lỗi server" });
  }
};

exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Thiếu email" });

  // 🛑 Check email đã tồn tại chưa
  const existing = await User.findOne({ where: { email } });
  if (existing) {
    return res.status(409).json({ error: "Email đã tồn tại" }); // 409: Conflict
  }

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 phút

  try {
    // Lưu vào DB
    await EmailOtp.upsert({ email, otp, expires_at: expires });

    // Gửi email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: email,
      subject: "Xác nhận đăng ký",
      text: `Mã OTP của bạn là: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "Đã gửi OTP" });
  } catch (err) {
    console.error("Gửi OTP lỗi:", err);
    res.status(500).json({ error: "Gửi email thất bại" });
  }
};


exports.verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  const record = await EmailOtp.findOne({ where: { email } });

  if (!record) return res.status(400).json({ success: false, message: "Không tìm thấy OTP" });

  const now = new Date();
  if (record.otp !== otp || now > record.expires_at) {
    return res.status(400).json({ success: false, message: "OTP sai hoặc hết hạn" });
  }

  // Option: Xoá OTP sau khi dùng
  await EmailOtp.destroy({ where: { email } });

  res.json({ success: true });
};

// Đăng nhập bằng Google
exports.loginGoogle = async (req, res) => {
  const { idToken } = req.body;

  try {
    const ticket = await client.verifyIdToken({
      idToken,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    const { email, name } = payload;

    if (!email) {
      return res.status(400).json({ error: "Không nhận được email từ Google" });
    }

    let user = await User.findOne({ where: { email } });

    if (!user) {
      user = await User.create({
        name: name || "No Name",
        email,
        password: "google-auth",
        provider: "google",
      });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: "7d",
    });

    res.json({
      message: "Đăng nhập Google thành công",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Google login failed:", err); // 👈 log thật rõ
    res.status(500).json({ error: "Đăng nhập Google thất bại", detail: err.message });
  }
};

// Like Song
exports.likeSong = async (req, res) => {
  const { songId } = req.body;
  const userId = req.user.id;

  try {
    await UserLikedSong.findOrCreate({
      where: { user_id: userId, song_id: songId },
    });
    res.json({ success: true, message: "Đã like bài hát" });
  } catch (error) {
    console.error("❌ Lỗi like bài hát:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Unlike Song
exports.unlikeSong = async (req, res) => {
  const { songId } = req.body;
  const userId = req.user.id;

  try {
    await UserLikedSong.destroy({ where: { user_id: userId, song_id: songId } });
    res.json({ success: true, message: "Đã bỏ like bài hát" });
  } catch (error) {
    console.error("❌ Lỗi unlike bài hát:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Like Playlist
exports.likePlaylist = async (req, res) => {
  const { playlistId } = req.body;
  const userId = req.user.id;

  try {
    await UserLikedPlaylist.findOrCreate({
      where: { user_id: userId, playlist_id: playlistId },
    });
    res.json({ success: true, message: "Đã like playlist" });
  } catch (error) {
    console.error("❌ Lỗi like playlist:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Unlike Playlist
exports.unlikePlaylist = async (req, res) => {
  const { playlistId } = req.body;
  const userId = req.user.id;

  try {
    await UserLikedPlaylist.destroy({ where: { user_id: userId, playlist_id: playlistId } });
    res.json({ success: true, message: "Đã bỏ like playlist" });
  } catch (error) {
    console.error("❌ Lỗi unlike playlist:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Follow Artist
exports.followArtist = async (req, res) => {
  const { artistId } = req.body;
  const userId = req.user.id;

  try {
    await UserFollowedArtist.findOrCreate({
      where: { user_id: userId, artist_id: artistId },
    });
    res.json({ success: true, message: "Đã follow artist" });
  } catch (error) {
    console.error("❌ Lỗi follow artist:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Unfollow Artist
exports.unfollowArtist = async (req, res) => {
  const { artistId } = req.body;
  const userId = req.user.id;

  try {
    await UserFollowedArtist.destroy({ where: { user_id: userId, artist_id: artistId } });
    res.json({ success: true, message: "Đã unfollow artist" });
  } catch (error) {
    console.error("❌ Lỗi unfollow artist:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Get all liked songs
exports.getLikedSongs = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: {
        model: Song,
        as: "likedSongs",
      },
    });
    res.json(user.likedSongs);
  } catch (error) {
    console.error("❌ Lỗi lấy liked songs:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Get all liked playlists
exports.getLikedPlaylists = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: {
        model: Playlist,
        as: "likedPlaylists",
      },
    });
    res.json(user.likedPlaylists);
  } catch (error) {
    console.error("❌ Lỗi lấy liked playlists:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Get all followed artists
exports.getFollowedArtists = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: {
        model: Artist,
        as: "followedArtists",
      },
    });
    res.json(user.followedArtists);
  } catch (error) {
    console.error("❌ Lỗi lấy followed artists:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Download Song
exports.downloadSong = async (req, res) => {
  const { songId } = req.body;
  const userId = req.user.id;

  try {
    await UserDownloadedSong.findOrCreate({
      where: { user_id: userId, song_id: songId },
    });
    res.json({ success: true, message: "Đã download bài hát" });
  } catch (error) {
    console.error("❌ Lỗi download bài hát:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

// Get all downloaded songs
exports.getDownloadedSongs = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      include: {
        model: Song,
        as: "downloadedSongs",
      },
    });
    res.json(user.downloadedSongs);
  } catch (error) {
    console.error("❌ Lỗi lấy downloaded songs:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

exports.sendResetOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: "Thiếu email" });

  const user = await User.findOne({ where: { email } });
  if (!user) return res.status(404).json({ error: "Không tìm thấy tài khoản với email này" });

  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expires = new Date(Date.now() + 5 * 60 * 1000); // OTP hết hạn sau 5 phút

  try {
    await EmailOtp.upsert({ email, otp, expires_at: expires });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.MAIL_USERNAME,
        pass: process.env.MAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.MAIL_USERNAME,
      to: email,
      subject: "Khôi phục mật khẩu",
      text: `Mã OTP đặt lại mật khẩu của bạn là: ${otp}`,
    };

    await transporter.sendMail(mailOptions);
    res.json({ message: "OTP khôi phục mật khẩu đã được gửi" });
  } catch (err) {
    console.error("❌ Lỗi gửi OTP reset password:", err);
    res.status(500).json({ error: "Gửi email thất bại" });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;

  if (!email || !otp || !newPassword) {
    return res.status(400).json({ error: "Thiếu thông tin" });
  }

  const record = await EmailOtp.findOne({ where: { email } });
  if (!record) return res.status(400).json({ error: "Không tìm thấy OTP" });

  if (record.otp !== otp || new Date() > record.expires_at) {
    return res.status(400).json({ error: "OTP sai hoặc hết hạn" });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await User.update({ password: hashedPassword }, { where: { email } });

    // ✅ Xoá OTP chỉ khi thành công
    await EmailOtp.destroy({ where: { email } });

    res.json({ message: "Đặt lại mật khẩu thành công" });
  } catch (error) {
    console.error("❌ Lỗi reset mật khẩu:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

//otp for reset pass
exports.verifyOtpReset = async (req, res) => {
  const { email, otp } = req.body;

  const record = await EmailOtp.findOne({ where: { email } });
  if (!record) return res.status(400).json({ success: false, message: "Không tìm thấy OTP" });

  const now = new Date();
  if (record.otp !== otp || now > record.expires_at) {
    return res.status(400).json({ success: false, message: "OTP sai hoặc hết hạn" });
  }

  res.json({ success: true });
};

//update profile
exports.updateProfile = async (req, res) => {
  const userId = req.user.id;
  const {
    name,
    phone,
    email, // email mới nếu thay đổi
    otp,   // OTP nếu đổi email
    oldPassword,
    newPassword,
  } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({ error: "Không tìm thấy người dùng" });
    }

    const updateData = {};
    if (name) updateData.name = name;
    if (phone) updateData.phone = phone;

    // 📧 Nếu muốn đổi email
    if (email && email !== user.email) {
      if (!otp) return res.status(400).json({ error: "Thiếu OTP để xác minh email mới" });
      const record = await EmailOtp.findOne({ where: { email } });
      if (!record || record.otp !== otp || new Date() > record.expires_at) {
        return res.status(400).json({ error: "OTP sai hoặc hết hạn" });
      }
      updateData.email = email;
      await EmailOtp.destroy({ where: { email } }); // Xóa OTP sau khi dùng
    }

    // 🔐 Nếu muốn đổi mật khẩu
    if (newPassword) {
      if (!oldPassword) {
        return res.status(400).json({ error: "Thiếu mật khẩu hiện tại" });
      }
      const isMatch = await bcrypt.compare(oldPassword, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: "Mật khẩu hiện tại không đúng" });
      }
      const hashedNewPassword = await bcrypt.hash(newPassword, 10);
      updateData.password = hashedNewPassword;
    }

    // 🖼️ Nếu đổi ảnh đại diện (Cloudinary upload)
    if (req.file) {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: "avatars" },
        async (error, result) => {
          if (error) {
            console.error("❌ Lỗi upload ảnh:", error);
            return res.status(500).json({ error: "Upload ảnh thất bại" });
          }
          updateData.avatar = result.secure_url;
          await user.update(updateData);
          return res.json({
            message: "Cập nhật thành công",
            user: {
              id: user.id,
              name: user.name,
              phone: user.phone,
              email: user.email,
              avatar: result.secure_url,
            },
          });
        }
      );
      streamifier.createReadStream(req.file.buffer).pipe(uploadStream);
    } else {
      await user.update(updateData);
      return res.json({
        message: "Cập nhật thành công",
        user: {
          id: user.id,
          name: user.name,
          phone: user.phone,
          email: user.email,
          avatar: user.avatar,
        },
      });
    }
  } catch (error) {
    console.error("❌ Lỗi update profile:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};
