module.exports = (sequelize, DataTypes) => {
    const UserDownloadedSong = sequelize.define(
      "UserDownloadedSong",
      {
        user_id: {
          type: DataTypes.UUID,
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
      },
      {
        tableName: "user_downloaded_song",
        timestamps: false,
      }
    );
    return UserDownloadedSong;
  };
  