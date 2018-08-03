var router = require("express").Router(); //bo dinh tuyen
var message = require("./../utils/message");
var roleController = require("./../controllers/role.controller");

module.exports = () => {
  router.get("/:id", getRole);
  router.post("/", createRole);
  return router;
};
function getRole(req, res, next) {
  var request = req.params.id;
  roleController
    .getRole(request)
    .then(function(response) {
      res.send(response);
    })
    .catch(function(err) {
      next(err);
    });
}

function createRole(req, res, next) {
  var request = req.body.name;
  if (!request) {
    res.status(400).send({ message: message.ERROR_MESSAGE.ROLE.EMPTY_NAME });
  } else {
    roleController
      .createRole(request)
      .then(response => {
        res.send(response);
      })
      .catch(err => {
        next(err);
      });
  }
}
