var User = require("./../models/user.model");
var message = require("./../utils/message");
var crypto = require("./../utils/crypto");
var Role = require("./../models/role.model");
var config = require("./../config");
module.exports = {
  getAllUser: getAllUser,
  createUser: createUser,
  getUser: getUser,
  updateUser_PASS: updateUser_PASS,
  loginUser: loginUser,
  updateUser_INFO: updateUser_INFO,
  getUserByEmail: getUserByEmail
};

function getAllUser() {
  return new Promise((resolve, reject) => {
    User.findAll()
      .then(result => resolve(result))
      .catch(err => reject(err));
  });
}

function getUser(request) {
  return new Promise((resolve, reject) => {
    User.find({ where: { id: request } })
      .then(userModel => {
        if (userModel) {
          resolve(userModel);
        } else {
          reject({
            statusCode: 404,
            message: message.ERROR_MESSAGE.USER.NOT_FOUND
          });
        }
      })
      .catch(err => reject(err));
  });
}

function getUserByEmail(request) {
  return new Promise((resolve, reject) => {
    User.find({ where: { email: request } })
      .then(userModel => {
        if (userModel) {
          resolve(userModel);
        } else {
          reject({
            statusCode: 404,
            message: message.ERROR_MESSAGE.USER.NOT_FOUND
          });
        }
      })
      .catch(err => reject(err));
  });
}

function createUser(request) {
  return new Promise((resolve, reject) => {
    User.find({
      where: { email: request.email }
    })
      .then(userModel => {
        if (!userModel) {
          if (!request.role) request.role = config.ROLE.USER;
          Role.find({ where: { name: request.role } })
            .then(roleModel => {
              if (roleModel || (!roleModel && !request.role)) {
                var salt = crypto.genSalt();
                var newUser = {
                  email: request.email,
                  name: request.name,
                  salt: salt,
                  password: crypto.hashWithSalt(request.password, salt),
                  phone: request.phone,
                  usersRolesIdFkeyId: roleModel.id
                };
                User.create(
                  newUser /* , {
                  include: [{ model: Role, as: "users_roles_id_fkey" }]
                } */
                )
                  .then(newUser =>
                    resolve({
                      newUser,
                      message: message.SUCCESS_MESSAGE.USER.CREATED
                    })
                  )
                  .catch(err => reject(err));
              } else {
                reject({
                  statusCode: 404,
                  message: message.ERROR_MESSAGE.ROLE.NOT_FOUND
                });
              }
            })
            .catch(err => reject(err));
        } else {
          reject({
            statusCode: 400,
            message: message.ERROR_MESSAGE.USER.EXIST
          });
        }
      })
      .catch(err => reject(err));
  });
}

function loginUser(request) {
  return new Promise((resolve, reject) => {
    User.find({
      email: request.email
    })
      .catch(err => reject(err))
      .then(userModel => {
        if (!userModel) {
          reject({
            statusCode: 404,
            message: message.ERROR_MESSAGE.USER.NOT_FOUND
          });
        } else {
          var pass = crypto.hashWithSalt(request.password, userModel.salt);
          if (pass !== userModel.password) {
            reject({
              statusCode: 400,
              message: message.ERROR_MESSAGE.USER.WRONG_PASS
            });
          } else {
            resolve({
              userModel: userModel,
              message: message.SUCCESS_MESSAGE.USER.LOGIN
            });
          }
        }
      });
  });
}

function updateUser_PASS(request) {
  return new Promise((resolve, reject) => {
    User.find({ where: { email: request.user.email } })
      .catch(err => reject(err))
      .then(userModel => {
        if (!userModel) {
          reject({
            statusCode: 404,
            message: message.ERROR_MESSAGE.USER.NOT_FOUND
          });
        } else {
          var oldPass = crypto.hashWithSalt(request.oldPass, userModel.salt);
          if (oldPass !== userModel.password) {
            reject({
              statusCode: 400,
              message: message.ERROR_MESSAGE.USER.WRONG_PASS
            });
          } else {
            var newSalt = crypto.genSalt();
            var newPassword = crypto.hashWithSalt(request.newPass, newSalt);
            userModel.salt = newSalt;
            userModel.password = newPassword;
            userModel
              .save()
              .catch(err => reject(err))
              .then(userModel =>
                resolve({
                  user: userModel,
                  message: message.SUCCESS_MESSAGE.USER.CHANGE.PASS
                })
              );
          }
        }
      });
  });
}

function updateUser_INFO(request) {
  return new Promise((resolve, reject) => {
    User.find({ where: { email: request.user.email } })
      .catch(err => reject(err))
      .then(userModel => {
        if (!userModel) {
          reject({
            statusCode: 400,
            message: message.ERROR_MESSAGE.USER.NOT_FOUND
          });
        } else {
          userModel.name = request.newName || userModel.name;
          userModel.phone = request.newPhone || userModel.phone;
          userModel
            .save()
            .catch(err => reject(err))
            .then(userModel =>
              resolve({
                user: userModel,
                message: message.SUCCESS_MESSAGE.USER.CHANGE.PASS
              })
            );
        }
      });
  });
}
