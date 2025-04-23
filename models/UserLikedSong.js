module.exports = (sequelize, DataTypes) => {
    const UserLikedSong = sequelize.define(
      "UserLikedSong",
      {
        user_id: {
          type: DataTypes.UUID,
          primaryKey: true,
        },
        song_id: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
      },
      {
        tableName: "user_liked_song",
        timestamps: false,
      }
    );
    return UserLikedSong;
  };
  