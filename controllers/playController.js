const { UserPlayedSong, Song, Artist, Album } = require("../models");

// Ghi lại lịch sử play
const recordPlay = async (req, res) => {
  const { userId, songId } = req.body;

  try {
    await UserPlayedSong.create({
      user_id: userId,
      song_id: songId,
    });

    res.json({ message: "Ghi lại bài hát thành công" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Lỗi server khi ghi lại bài hát" });
  }
};

// Lấy danh sách Recently Played
const getRecentlyPlayed = async (req, res) => {
  const { userId } = req.params;

  try {
    const songs = await UserPlayedSong.findAll({
      where: { user_id: userId },
      include: [
        {
          model: Song,
          include: [
            {
              model: Artist,
              attributes: ["id", "name"],
              through: { attributes: [] },
            },
            { model: Album, attributes: ["id", "name", "release_date"] },
          ],
        },
      ],
      order: [["played_at", "DESC"]],
      limit: 20,
    });

    const formattedSongs = songs.map((record) => ({
      id: record.Song.id,
      title: record.Song.title,
      album_cover: record.Song.album_cover,
      Artists: record.Song.Artists,
      Album: record.Song.Album,
      played_at: record.played_at,
    }));

    res.json(formattedSongs);
  } catch (err) {
    console.error(err);
    res
      .status(500)
      .json({ error: "Lỗi server khi lấy danh sách Recently Played" });
  }
};

module.exports = {
  recordPlay,
  getRecentlyPlayed,
};
