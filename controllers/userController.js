const { User } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const { EmailOtp } = require("../models");

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
    const user = await User.create({ name, email, password: hashedPassword, phone });

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
  