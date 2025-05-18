module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    "User",
    {
      id: {
        type: DataTypes.STRING,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: true,
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: true, // 🔥 Cho phép null để support login bằng Google
      },
      phone: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      provider: {
        type: DataTypes.STRING,
        defaultValue: "local", // "local" hoặc "google"
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      tableName: "users",
      timestamps: true,
    }
  );

  User.associate = (models) => {
    User.belongsToMany(models.Song, {
      through: models.UserLikedSong,
      foreignKey: "user_id",
      otherKey: "song_id",
      as: "likedSongs",
    });
    User.belongsToMany(models.Playlist, {
      through: models.UserLikedPlaylist,
      foreignKey: "user_id",
      as: "likedPlaylists",
    });
    User.belongsToMany(models.Artist, {
      through: models.UserFollowedArtist,
      foreignKey: "user_id",
      as: "followedArtists",
    });
    User.belongsToMany(models.Song, {
      through: models.UserDownloadedSong,
      foreignKey: "user_id",
      as: "downloadedSongs",
    });
    User.belongsToMany(models.Song, {
      through: "user_played_song",
      foreignKey: "user_id",
      as: "playedSongs",
    });
  };

  return User;
};
