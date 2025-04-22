module.exports = (sequelize, DataTypes) => {
    const UserLikedPlaylist = sequelize.define(
      "UserLikedPlaylist",
      {
        user_id: {
          type: DataTypes.UUID,
          primaryKey: true,
        },
        playlist_id: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
      },
      {
        tableName: "user_liked_playlist",
        timestamps: false,
      }
    );
    return UserLikedPlaylist;
  };
  