module.exports = (sequelize, DataTypes) => {
  const UserPlayedSong = sequelize.define(
    "UserPlayedSong",
    {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      user_id: { type: DataTypes.STRING, allowNull: false },
      song_id: { type: DataTypes.STRING, allowNull: false },
      played_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
    },
    {
      tableName: "user_played_song",
      timestamps: false,
    }
  );

  UserPlayedSong.associate = (models) => {
    UserPlayedSong.belongsTo(models.User, { foreignKey: "user_id" });
    UserPlayedSong.belongsTo(models.Song, { foreignKey: "song_id" });
  };

  return UserPlayedSong;
};
