module.exports = (sequelize, DataTypes) => {
  const UserLikedSong = sequelize.define(
    "UserLikedSong",
    {
      user_id: {
        type: DataTypes.STRING,
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

  UserLikedSong.associate = (models) => {
    UserLikedSong.belongsTo(models.User, {
      foreignKey: "user_id",
      targetKey: "id",
      as: "user",
    });

    UserLikedSong.belongsTo(models.Song, {
      foreignKey: "song_id",
      targetKey: "id",
      as: "song",
    });
  };

  return UserLikedSong;
};
