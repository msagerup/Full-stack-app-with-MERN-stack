const express = require("express");
const mongoose = require("mongoose");

// import files
const users = require("./routes/api/users");
const posts = require("./routes/api/posts");
const profile = require("./routes/api/profile");

const app = express();

// Require Key to the DB from keys.js
const db = require("./config/keys").mongoURI;

// Connect to MongoDB
mongoose
  .connect(db)
  .then(() => console.log("Connected to DataBase"))
  .catch(err => console.log(err));

// Intial Route
app.get("/", (req, res) => res.send("Hello"));

// Use Routes
app.use("/api/users", users);
app.use("/api/profile", profile);
app.use("/api/posts", posts);

const port = process.env.port || 5000;

app.listen(port, () => console.log(`Listening to port: ${port}`));
