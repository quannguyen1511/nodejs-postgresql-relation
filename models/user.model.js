const Sequelize = require("sequelize");
var sequelize = require("./../db/index");
var Role = require("./role.model");
const User = sequelize.define("user", {
  name: {
    type: Sequelize.STRING
  },
  email: {
    type: Sequelize.STRING
  },
  salt: {
    type: Sequelize.STRING
  },
  password: {
    type: Sequelize.STRING
  },
  phone: {
    type: Sequelize.STRING
  }
});
User.belongsTo(Role, { as: "users_roles_id_fkey" });
module.exports = User;
