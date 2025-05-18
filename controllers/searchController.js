const { Op } = require("sequelize");
const {
  Song,
  Artist,
  Album,
  Playlist,
  AlbumArtist,
  SongArtist,
} = require("../models");

const search = async (req, res) => {
  const query = req.query.q;
  if (!query || query.trim() === "") {
    return res.status(400).json({ error: "Missing or empty query" });
  }

  const keyword = `%${query.trim()}%`;

  try {
    const songs = await Song.findAll({
      where: {
        [Op.or]: [{ title: { [Op.like]: keyword } }],
      },
      include: [
        {
          model: Artist,
          where: {
            name: { [Op.like]: keyword },
          },
          required: false,
          through: { attributes: [] },
          attributes: ["id", "name"],
        },
      ],
      limit: 10,
    });

    // ARTIST
    const artists = await Artist.findAll({
      where: {
        name: { [Op.like]: keyword },
      },
      limit: 10,
    });

    // ALBUM
    const albums = await Album.findAll({
      where: {
        name: { [Op.like]: keyword },
      },
      limit: 10,
    });

    // PLAYLIST
    const playlists = await Playlist.findAll({
      where: {
        name: { [Op.like]: keyword },
      },
      limit: 10,
    });

    return res.json({ songs, artists, albums, playlists });
  } catch (error) {
    console.error("Search error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  search,
};
