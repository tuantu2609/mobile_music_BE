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
      like_count: {
        type: DataTypes.INTEGER,
        defaultValue: 0, // default like count to 0
      },
    },
    {
      tableName: "user_liked_song",
      timestamps: false,
    }
  );

  UserLikedSong.associate = (models) => {
    UserLikedSong.belongsTo(models.Song, {
      foreignKey: "song_id",
      as: "song", // Alias để sử dụng trong truy vấn
    });
  };

  return UserLikedSong;
};
