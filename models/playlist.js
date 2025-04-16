module.exports = (sequelize, DataTypes) => {
  const Playlist = sequelize.define("Playlist", {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    description: DataTypes.TEXT,
    creatorName: DataTypes.STRING,
    total_tracks: DataTypes.INTEGER,
    external_url: DataTypes.TEXT,
  });

  Playlist.associate = (models) => {
    Playlist.hasMany(models.Image, {
      foreignKey: "ref_id",
      scope: { ref_type: "playlist" },
      as: "images",
    });
  };

  return Playlist;
};
