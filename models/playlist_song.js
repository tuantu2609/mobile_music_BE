module.exports = (sequelize, DataTypes) => {
  const PlaylistSong = sequelize.define(
    "PlaylistSong",
    {
      playlist_id: { type: DataTypes.STRING, primaryKey: true },
      song_id: { type: DataTypes.STRING, primaryKey: true },
    },
    {
      tableName: "playlist_song",
      timestamps: true,
    }
  );

  return PlaylistSong;
};
