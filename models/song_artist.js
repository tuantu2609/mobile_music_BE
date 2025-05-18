module.exports = (sequelize, DataTypes) => {
  const SongArtist = sequelize.define(
    "SongArtist",
    {
      song_id: { type: DataTypes.STRING, primaryKey: true },
      artist_id: { type: DataTypes.STRING, primaryKey: true },
    },
    {
      tableName: "song_artist",
      timestamps: true,
    }
  );

  return SongArtist;
};
