var router = require("express").Router(); //bo dinh tuyen
var message = require("./../utils/message");
var userController = require("./../controllers/user.controller");
var config = require("./../config");
var auth = require("./../middlewares/jwt-parser");
var authController = require("../controllers/auth.controller");

module.exports = () => {
  router.get("/", auth.parser(config.ROLE.ALL), getAllUser);
  router.get("/:id", auth.parser(config.ROLE.ALL), getUser);
  router.post("/", /* auth.parser(config.ROLE.ADMIN),*/ createUser);
  router.post("/login", loginUser);
  router.put("/password", auth.parser(config.ROLE.ALL), updatePassword);
  router.put("/info", auth.parser(config.ROLE.ALL), updateInfo);
  return router;
};

var filterEmail = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
// var filterPass = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*\.\-\_])(?=.{6,})/;
var filterPass = /^([a-zA-Z0-9_\.\-]{6,})/;

function getAllUser(req, res, next) {
  userController
    .getAllUser()
    .then(function(response) {
      res.send(response);
    })
    .catch(function(err) {
      next(err);
    });
}

function getUser(req, res, next) {
  userController
    .getUser(req.params.id)
    .then(function(response) {
      res.send(response);
    })
    .catch(function(err) {
      next(err);
    });
}

function createUser(req, res, next) {
  var request = {
    email: req.body.email,
    password: req.body.password,
    name: req.body.name,
    phone: req.body.phone,
    role: req.body.role,
    user: req.user
  };
  if (!filterEmail.test(request.email)) {
    res
      .status(400)
      .send({ message: message.ERROR_MESSAGE.USER.NOT_STANDARD.EMAIL });
  } else if (!filterPass.test(request.password)) {
    res
      .status(400)
      .send({ message: message.ERROR_MESSAGE.USER.NOT_STANDARD.PASS });
  } else {
    userController
      .createUser(request)
      .then(response => {
        res.send(response);
      })
      .catch(err => {
        next(err);
      });
  }
}

function loginUser(req, res, next) {
  var request = {
    email: req.body.email,
    password: req.body.password
  };
  if (!filterPass.test(request.password)) {
    res
      .status(400)
      .send({ message: message.ERROR_MESSAGE.USER.NOT_STANDARD.PASS });
  } else if (!filterEmail.test(request.email)) {
    res
      .status(400)
      .send({ message: message.ERROR_MESSAGE.USER.NOT_STANDARD.EMAIL });
  } else {
    authController
      .validateUser(request)
      .then(response => {
        res.send(response);
      })
      .catch(err => {
        next(err);
      });
  }
}

function updatePassword(req, res, next) {
  var request = {
    oldPass: req.body.oldPass,
    newPass: req.body.newPass,
    user: req.user
  };
  userController
    .updateUser_PASS(request)
    .then(response => {
      res.send(response);
    })
    .catch(err => {
      next(err);
    });
}

function updateInfo(req, res, next) {
  var request = {
    newName: req.body.newName,
    newPhone: req.body.newPhone,
    user: req.user
  };
  userController
    .updateUser_INFO(request)
    .then(response => {
      res.send(response);
    })
    .catch(err => {
      next(err);
    });
}
