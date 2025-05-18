const { Artist, Album, Song, SongArtist } = require("../models");

const getArtistDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const artist = await Artist.findByPk(id);
    if (!artist) return res.status(404).json({ error: "Artist not found" });

    const albums = await Album.findAll({
      include: {
        model: Artist,
        where: { id },
        through: { attributes: [] },
      },
    });

    const songs = await Song.findAll({
      include: {
        model: Artist,
        where: { id },
        through: { attributes: [] },
      },
      limit: 10,
      order: [["popularity", "DESC"]],
    });

    return res.json({ artist, albums, songs });
  } catch (err) {
    console.error("Get artist failed:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = { getArtistDetails };
