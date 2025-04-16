module.exports = (sequelize, DataTypes) => {
  const AlbumArtist = sequelize.define(
    "AlbumArtist",
    {
      album_id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      artist_id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
    },
    {
      tableName: "album_artist",
      timestamps: false,
    }
  );

  return AlbumArtist;
};
