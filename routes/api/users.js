const express = require("express");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const router = express.Router();

// Load User model
const User = require("../models/User");

// @route   /api/users/test
// @desc    Tests users route
// access   Public
router.get("/test", (req, res) => res.json({ msg: "Users Works" }));

// @route   /api/users/register
// @desc    Register a user
// access   Public
router.post("/register", (req, res) => {
  // Since its connected to the Schema for mongoose, I can use
  // findOne() . This checks to see if there is a record in the DB of what the function is
  // searching for, defined in the object.
  User.findOne({ email: req.body.email }).then(user => {
    if (user) {
      // if there is an email in the DB, throw an 400 status.
      return res.status(400).json({ email: "Email already exists" });
    } else {
      // This just loads the Gravatar imgage library.
      // If the user has a gravatar it will use that image.
      const gravatar = gravatar.url(req.body.email, {
        s: "200", // Sets size of gravtar img
        r: "pg", // Rating of image, pg = child friendly
        d: "mm" // Sets the default image
      });
      // If there is not, create a new user in the DB.
      // we use new User() because we are create a resrouce with mongoose
      // and pass in the data as an object
      const newUser = new User({
        name: req.body.name,
        email: req.body.email,
        avatar: avatar,
        password: req.body.password
      });

      // To hide the password we need to hash it, we will use bcrypt
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          if (err) throw err;
          // Sets newUser password to the hash, (hides password from text to hash)
          newUser.password = hash;
          // Saves the password with mongoose
          newUser
            .save()
            .then(user => res.json(user))
            // chech if anything goes wrong
            .catch(err => console.log(err));
        });
      });
    }
  });
});

module.exports = router;
