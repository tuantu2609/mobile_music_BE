// models/UserDownloadedSong.js
module.exports = (sequelize, DataTypes) => {
  const UserDownloadedSong = sequelize.define(
    "UserDownloadedSong",
    {
      user_id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      song_id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      downloaded_at: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      artist_name: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      album_cover: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      tableName: "user_downloaded_song",
      timestamps: false,
    }
  );

  return UserDownloadedSong;
};
