module.exports = (sequelize, DataTypes) => {
  const Song = sequelize.define("Song", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    title: DataTypes.STRING,
    explicit: DataTypes.BOOLEAN,
    album_cover: DataTypes.TEXT,
    popularity: DataTypes.INTEGER,
    preview_url: DataTypes.TEXT,
    release_date: DataTypes.DATEONLY,
    is_playable: DataTypes.BOOLEAN,
    duration_ms: DataTypes.INTEGER,
    album_id: DataTypes.STRING,
  });

  Song.associate = (models) => {
    Song.belongsTo(models.Album, { foreignKey: "album_id" });
    Song.belongsToMany(models.Artist, {
      through: models.SongArtist,
      foreignKey: "song_id",
    });
  };

  return Song;
};
