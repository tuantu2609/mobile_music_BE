const { Song, Artist, Album } = require("../models");

const getAllSongs = async (req, res) => {
  try {
    const songs = await Song.findAll({
      include: [
        {
          model: Artist,
          attributes: ["id", "name"],
          through: { attributes: [] },
          required: false, // LEFT JOIN để tránh lỗi khi song không có artist
        },
        {
          model: Album,
          attributes: ["id", "name", "release_date"],
          required: false, // LEFT JOIN để tránh lỗi khi song không có album
        },
      ],
      limit: 50, // Tạm tắt để test đầy đủ
      order: [["popularity", "DESC"]],
    });
    res.json(songs);
  } catch (error) {
    console.error("❌ Lỗi lấy danh sách bài hát:", error);
    res.status(500).json({ error: "Lỗi server" });
  }
};

module.exports = {
  getAllSongs,
};
