module.exports = (sequelize, DataTypes) => {
  const Album = sequelize.define(
    "Album",
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      name: DataTypes.STRING,
      release_date: DataTypes.DATEONLY,
      album_type: DataTypes.STRING,
      total_tracks: DataTypes.INTEGER,
      genres: DataTypes.JSON,
      label: DataTypes.STRING,
      popularity: DataTypes.INTEGER,
      album_cover: DataTypes.STRING,
    },
    {
      tableName: "albums",
      timestamps: true,
    }
  );

  Album.associate = (models) => {
    Album.belongsToMany(models.Artist, {
      through: models.AlbumArtist,
      foreignKey: "album_id",
    });
    Album.hasMany(models.Song, {
      foreignKey: "album_id",
    });
  };

  return Album;
};
