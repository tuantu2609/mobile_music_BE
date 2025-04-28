module.exports = (sequelize, DataTypes) => {
  const Playlist = sequelize.define(
    "Playlist",
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
      creatorName: DataTypes.STRING,
      total_tracks: DataTypes.INTEGER,
      external_url: DataTypes.TEXT,
      image: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "playlists",
      timestamps: true,
    }
  );

  Playlist.associate = (models) => {
    Playlist.belongsToMany(models.Song, {
      through: models.PlaylistSong,
      foreignKey: "playlist_id",
    });
  };

  return Playlist;
};
