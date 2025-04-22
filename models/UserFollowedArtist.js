module.exports = (sequelize, DataTypes) => {
    const UserFollowedArtist = sequelize.define(
      "UserFollowedArtist",
      {
        user_id: {
          type: DataTypes.UUID,
          primaryKey: true,
        },
        artist_id: {
          type: DataTypes.STRING,
          primaryKey: true,
        },
      },
      {
        tableName: "user_followed_artist",
        timestamps: false,
      }
    );
    return UserFollowedArtist;
  };
  