const Sequelize = require("sequelize");
var sequelize = require("./../db/index");
const Role = sequelize.define("role", {
  name: {
    type: Sequelize.STRING
  }
});

module.exports = Role;
