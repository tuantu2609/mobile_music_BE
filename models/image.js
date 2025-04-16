module.exports = (sequelize, DataTypes) => {
  const Image = sequelize.define("Image", {
    url: DataTypes.TEXT,
    height: DataTypes.INTEGER,
    width: DataTypes.INTEGER,
    ref_type: DataTypes.ENUM("artist", "album", "playlist"),
    ref_id: DataTypes.STRING,
  });

  return Image;
};
