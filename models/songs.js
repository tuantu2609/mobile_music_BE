module.exports = (sequelize, DataTypes) => {
  const Song = sequelize.define(
    "Song",
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      title: DataTypes.STRING,
      explicit: DataTypes.BOOLEAN,
      album_cover: DataTypes.TEXT,
      popularity: DataTypes.INTEGER,
      preview_url: DataTypes.TEXT,
      release_date: DataTypes.DATEONLY,
      is_playable: DataTypes.BOOLEAN,
      duration_ms: DataTypes.INTEGER,
      album_id: DataTypes.STRING,
      url: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      lyrics: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "songs",
      timestamps: true,
    }
  );

  Song.associate = (models) => {
    Song.belongsTo(models.Album, { foreignKey: "album_id" });
    Song.belongsToMany(models.Artist, {
      through: models.SongArtist,
      foreignKey: "song_id",
    });
    Song.belongsToMany(models.Playlist, {
      through: models.PlaylistSong,
      foreignKey: "song_id",
    });
    // Thêm mối quan hệ với UserLikedSong
    Song.hasMany(models.UserLikedSong, {
      foreignKey: "song_id",
      as: "userLikedSongs", // Đặt alias để dễ dàng truy vấn
    });
    Song.belongsToMany(models.User, {
      through: models.UserDownloadedSong,
      foreignKey: "song_id",
    });
    
  };

  return Song;
};
