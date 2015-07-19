module.exports = function(sequelize, DataTypes) {

  var Image = sequelize.define("image", {

    author: DataTypes.STRING,
    link: DataTypes.STRING,
    description: DataTypes.TEXT
  },{

    underscored: true,
    tableName: "images"
  });

  return Image;
};