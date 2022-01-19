'use strict';
const {
  Model
} = require('sequelize');
const {sequelize, Sequelize} = require("../services/db");
const Organization = require("../models/organization")(sequelize, Sequelize.DataTypes)

module.exports = (sequelize, DataTypes) => {
  class relationship extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  };
  relationship.init({
    r_id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true // Automatically gets converted to SERIAL for postgres
    },
    r_org_id: DataTypes.INTEGER,
    r_daughter_id: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'relationship',
  });



  relationship.belongsTo(Organization, {as: 'daughter', foreignKey: 'r_daughter_id'})
  relationship.hasMany(Organization, { foreignKey: 'org_id' })

  relationship.belongsTo(Organization, {as: 'parent', foreignKey: 'r_org_id'})
  relationship.hasMany(Organization, { foreignKey: 'org_id' })

  return relationship;
};
