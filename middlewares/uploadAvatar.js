const multer = require("multer");
const path = require("path");

// Lưu file vào thư mục public/avatars/
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "public/avatars/");
  },
  filename: function (req, file, cb) {
    const uniqueName = `${Date.now()}-${file.originalname}`;
    cb(null, uniqueName);
  },
});

const fileFilter = (req, file, cb) => {
  const ext = path.extname(file.originalname).toLowerCase();
  if (ext !== ".jpg" && ext !== ".jpeg" && ext !== ".png") {
    return cb(new Error("Chỉ hỗ trợ file .jpg, .jpeg, .png"));
  }
  cb(null, true);
};

const upload = multer({ storage, fileFilter });

module.exports = upload;
