const { Playlist } = require("../models");

// API lấy danh sách Playlist
const getPlaylists = async (req, res) => {
  const limit = parseInt(req.query.limit) || 10;

  try {
    const playlists = await Playlist.findAll({
      limit,
      order: [["createdAt", "DESC"]],
    });

    res.json(playlists);
  } catch (error) {
    console.error("Error Fetch playlists:", error);
    res.status(500).json({ error: "Server Error" });
  }
};

module.exports = { getPlaylists };
