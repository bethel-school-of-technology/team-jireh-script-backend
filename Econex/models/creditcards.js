'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class creditcards extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
        this.belongsTo(models.Users);
    }
  }
  creditcards.init({
    CcId: {
      allowNull: false,
      autoIncrement: true, 
      primaryKey: true,
      type: DataTypes.INTEGER
    },
    UserId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'UserId'
      }
    },
    CcFirstName: DataTypes.STRING,
    CcLastName: DataTypes.STRING,
    CcNumber:DataTypes.STRING,
    CcSecurityCode: DataTypes.STRING,
    CcMonth:DataTypes.STRING,
    CcYear:DataTypes.STRING,
    Deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull:false 
    }
  }, {
    sequelize,
    modelName: 'creditcard',
  });
  return creditcards;
};  