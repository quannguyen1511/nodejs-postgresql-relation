//khai bao thu vien
// var db = require("./db");
var express = require("express"); //khai bao thu vien express
var bodyParser = require("body-parser"); //khai bao thu vien body-parser
//khai bao thu muc, duong dan, ham su dung
var config = require("./config");
var errorHandler = require("./middlewares/error-handler"); //khai bao su dung error-handler
var app = express();

var allowCrossDomain = function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*"); //tai nguyen co the truy cap boi bat cu ten mien nao
  res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH"); //cho pheo tuy cap vao tai nguyen = cac phuong thuc
  res.header("Access-Control-Allow-Headers", "Content-Type, x-access-token"); //
  next();
};

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(allowCrossDomain);

// app.use("/company", require("./routes/company.route")());
// app.use("/parkingLots", require("./routes/parkingLot.route")());
// app.use("/ticketOffice", require("./routes/ticketOffice.route")());
app.use("/user", require("./routes/user.route")());
app.use("/role", require("./routes/role.route")());

app.use(errorHandler.errorHandler());

app.listen(process.env.PORT || config.PORT);

console.log("Server is listening on port " + config.PORT);

/* //postgres
// app.get("/:id", function(req, res, next) {
//   var request = [req.params.id];
//   client.query("SELECT * FROM student where student_id = $1", request, function(
//     err,
//     result
//   ) {
//     if (err) {
//       console.log(err);
//       res.status(400).send(err);
//     }
//     res.status(200).send(result.rows);
//   });
// });

// app.get("/", function(req, res, next) {
//   client.query("SELECT * FROM student", function(err, result) {
//     if (err) {
//       console.log(err);
//       res.status(400).send(err);
//     }
//     res.status(200).send(result.rows);
//   });
// });

// app.post("/", function(req, res, next) {
//   var request = [req.body.id, req.body.first_name, req.body.last_name];
//   client.query("INSERT INTO student VALUES ($1, $2, $3);", request, function(
//     err,
//     result
//   ) {
//     if (err) {
//       console.log(err);
//       res.status(400).send(err);
//     }
//     res.status(200).send(result);
//     console.log(result);
//   });
// });
// app.delete("/:id", function(req, res, next) {
//   var request = [req.params.id];
//   client.query("DELETE FROM student WHERE student_id = $1", request, function(
//     err,
//     result
//   ) {
//     if (err) {
//       console.log(err);
//       res.status(400).send(err);
//     }
//     res.status(200).send(result.rows);
//   });
// });

app.listen(4000, function() {
  console.log("Server is running.. on Port 4000");
});
 */
