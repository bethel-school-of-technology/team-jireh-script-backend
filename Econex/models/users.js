'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
     this.hasMany(models.categories,{
       foriegnKey: 'userId'
     })
    }
  };
  Users.init({
    UserId: {
      allowNull: false,
      autoIncrement: true,
      primaryKey: true,
      type: DataTypes.INTEGER 
    },
    FirstName: DataTypes.STRING,
    LastName: DataTypes.STRING,
    Username:{
      type: DataTypes.STRING,
      unique: true
    },
    BusinessName:{
      type:DataTypes.STRING,
      unique: true
    },
    Password: DataTypes.STRING,
    Email: {
      type: DataTypes.STRING,
      unique: true
    },
    Deleted: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    Admin: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    },
    Seller: {
      type: DataTypes.BOOLEAN,
      defaultValue: false,
      allowNull: false
    }
  }, {
    sequelize,
    modelName: 'Users',
  });
  return Users;
};