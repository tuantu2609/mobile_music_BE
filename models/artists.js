module.exports = (sequelize, DataTypes) => {
  const Artist = sequelize.define(
    "Artist",
    {
      id: { type: DataTypes.STRING, primaryKey: true },
      name: DataTypes.STRING,
      genres: DataTypes.JSON,
      popularity: DataTypes.INTEGER,
      external_url: DataTypes.TEXT,
      followers: DataTypes.INTEGER,
    },
    {
      tableName: "artists",
      timestamps: true,
    }
  );

  Artist.associate = (models) => {
    Artist.belongsToMany(models.Album, {
      through: models.AlbumArtist,
      foreignKey: "artist_id",
    });
    Artist.belongsToMany(models.Song, {
      through: models.SongArtist,
      foreignKey: "artist_id",
    });
  };

  return Artist;
};
