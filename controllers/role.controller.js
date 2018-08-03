var Role = require("./../models/role.model");
var message = require("./../utils/message");

module.exports = {
  getRole,
  createRole
};

function getRole(request) {
  return new Promise((resolve, reject) => {
    Role.find({ where: { id: request } })
      .then(RoleModel => {
        if (RoleModel) {
          resolve(RoleModel);
        } else {
          reject({
            statusCode: 404,
            message: message.ERROR_MESSAGE.ROLE.NOT_FOUND
          });
        }
      })
      .catch(err => reject(err));
  });
}

function createRole(request) {
  return new Promise((resolve, reject) => {
    Role.find({ where: { name: request } })
      .then(RoleModel => {
        if (!RoleModel) {
          var newRole = new Role({ name: request });
          newRole
            .save()
            .then(newRole =>
              resolve({
                newRole,
                message: message.SUCCESS_MESSAGE.ROLE.CREATED
              })
            )
            .catch(err => reject(err));
        } else {
          reject({
            statusCode: 400,
            message: message.ERROR_MESSAGE.ROLE.EXIST
          });
        }
      })
      .catch(err => reject(err));
  });
}
