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

module.exports = { getAlbumDetails };
