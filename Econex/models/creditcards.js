'use strict';
const {
    Model
  } = require('sequelize');
  module.exports = (sequelize, DataTypes) => {
    class CreditCards extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) {
        this.belongsTo(models.Users);
      }
    }
    CreditCards.init({
      CcId:{
        type: DataTypes.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
      },
      UserId: {
        type: DataTypes.INTEGER,
        references: {
          model: 'Users',
          key: 'UserId'
        }
      },
      CardFirstName: DataTypes.STRING,
      CardLastName: DataTypes.STRING,
      CardNumber: DataTypes.NUMBER,
      SecurityCode: DataTypes.NUMBER,
      ExpirationMonth: DataTypes.NUMBER,
      ExpirationYear: DataTypes.NUMBER,
      Deleted:{
        type:DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false
      }
    }, {
      sequelize,
      modelName: 'CreditCards',
    });
    return CreditCards;
  };