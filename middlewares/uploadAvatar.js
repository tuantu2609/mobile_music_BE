// middlewares/uploadAvatar.js
const multer = require("multer");

const storage = multer.memoryStorage(); // 🧠 Dùng buffer thay vì lưu file local

const fileFilter = (req, file, cb) => {
  const ext = file.originalname.toLowerCase();
  if (!ext.match(/\.(jpg|jpeg|png)$/)) {
    return cb(new Error("Chỉ hỗ trợ file .jpg, .jpeg, .png"));
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });
module.exports = upload;
