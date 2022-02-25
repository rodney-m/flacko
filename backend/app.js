const express = require("express");
const app = express();
const morgan = require("morgan");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv/config");
const authJwt = require("./helpers/jwt");

app.use(cors());
app.options("*", cors());

// Middleware
app.use(express.json());
app.use(morgan("tiny"));
app.use(authJwt());
app.use("/public/uploads", express.static(__dirname + "/public/uploads"));
app.use(function (err, req, res, next) {
  if (err.name === "UnauthorizedError") {
    // jwt authentication error
    return res
      .status(401)
      .json({ message: "The user is not authorized", error: err });
  }

  if (err.name === "ValidationError") {
    // validation error
    return res.status(401).json({ message: err });
  }

  // default to 500 server error
  return res.status(500).json(err);
});

//Routes
const usersRoutes = require("./routes/users");

const api = process.env.API_URL;

app.use(`${api}/users`, usersRoutes);

// Database
mongoose
  .connect(process.env.CONNECTION_STRING)
  .then(() => {
    console.log("Database Connection is ready...");
  })
  .catch((err) => {
    console.log(err);
  });

// Server
const PORT = 3000
app.listen(3000, () => {
  console.log("server running on port 3000");
});
