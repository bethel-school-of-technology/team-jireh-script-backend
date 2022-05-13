'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        this.belongsTo(models.Users);
    }
  }
  categories.init({
    itemId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER
    },
   
    itemName: DataTypes.STRING,
    itemPrice:{ 
      type: DataTypes.DECIMAL(10,2),
      allowNull: false
    },
    itemSeller: DataTypes.STRING,
    imgURL:DataTypes.STRING,
    Deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull:false 
    }
  }, {
    sequelize,
    modelName: 'categories',
  });
  return categories;
};  