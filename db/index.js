const Sequelize = require("sequelize");
var config = require("./../config").postgres;
const sequelize = new Sequelize(
  //   "postgres://postgres:quan1511@localhost:5432/mytestdb"
  "postgres://" +
    config.user +
    ":" +
    config.password +
    config.host +
    "/" +
    config.database
);
sequelize
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch(err => {
    console.error("Unable to connect to the database:", err);
  });

module.exports = sequelize;
