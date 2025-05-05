const { Album, Song, Artist } = require("../models");

const getAlbumDetails = async (req, res) => {
  const { id } = req.params;
  try {
    const album = await Album.findByPk(id, {
      attributes: [
        "id",
        "name",
        "album_cover",
        "release_date",
        "album_type",
        "total_tracks",
        "genres",
        "label",
        "popularity",
      ],
      include: [
        {
          model: Song,
          attributes: ["id", "title", "album_cover", "duration_ms"],
          include: [
            {
              model: Artist,
              attributes: ["id", "name"],
              through: { attributes: [] },
            },
          ],
        },
      ],
    });

    if (!album) {
      return res.status(404).json({ error: "Album not found" });
    }

    res.json(album);
  } catch (error) {
    console.error("Error fetching album:", error);
    res.status(500).json({ error: "Server error" });
  }
};

const getAllAlbums = async (req, res) => {
  try {
    const albums = await Album.findAll({
      attributes: [
        "id",
        "name",
        "album_cover",
        "release_date",
        "album_type",
        "total_tracks",
        "genres",
        "label",
        "popularity",
      ],
      include: [
        {
          model: Artist,
          attributes: ["id", "name"],
          through: { attributes: [] }, // bỏ thuộc tính trung gian
        },
      ],
      order: [["popularity", "DESC"]],
      limit: 50, // optional: giới hạn kết quả
    });

    res.json(albums);
  } catch (error) {
    console.error("Error fetching albums:", error);
    res.status(500).json({ error: "Server error" });
  }
};

module.exports = { getAlbumDetails, getAllAlbums };
