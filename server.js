const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const passport = require("passport");

// import files
const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const profile = require("./routes/api/profile");

const app = express();

// Use Body Parser middleware, this is used to check if there is entry in the databse.
// i.e with the findOne() function defined in users.js
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Require Key to the DB from keys.js
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("Connected to DataBase"))
  .catch(err => console.log(err));

// Passport Middleware
app.use(passport.initialize());

// Passport Config
require("./config/passport.js")(passport);

// Use Routes that's in routes/api
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.port || 5000;

app.listen(port, () => console.log(`Listening to port: ${port}`));
