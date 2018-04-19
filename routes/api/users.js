const express = require("express");
const gravatar = require("gravatar");
const bcrypt = require("bcryptjs");
const router = express.Router();
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

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
      const avatar = gravatar.url(req.body.email, {
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
        avatar,
        password: req.body.password
      });

      // To hide the password we need to hash it, we will use bcrypt
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newUser.password, salt, (err, hash) => {
          // if (err) throw err;
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

// @route   /api/users/login
// @desc    Login User / returning token
// access   Public

router.post("/login", (req, res) => {
  // Remember when sending a form it will be a req.body because we use body parser (npm)
  const email = req.body.email;
  const password = req.body.password;

  // Find user by email, remember .findOne() searches the DB for an entry
  User.findOne({ email: email }).then(user => {
    // If there is no user, send 404, not found
    if (!user) {
      return res.status(404).json({ email: "User not found" });
    }

    // Check Password using bcrypt
    // user.password is from the DB
    bcrypt
      .compare(password, user.password)
      // This return a true of false, I will call it isMatch
      .then(isMatch => {
        // If its true
        if (isMatch) {
          // If true, User is matched
          // Creacte JTW payload, what info you want to get
          const payload = {
            id: user.id,
            name: user.name,
            avatar: user.avatar
          };
          // Sign Token
          jwt.sign(
            payload,
            keys.secretOrKey,
            { expiresIn: 3600 },
            (err, token) => {
              res.json({
                success: true,
                token: "Bearer " + token
              });
            }
          );
          // If it's not true, send a 400 and a message
        } else {
          return res.status(400).json({ password: "Password is incorrect" });
        }
      });
  });
});

// @route   /api/users/current
// @desc    Return current user
// access   Private

router.get(
  "/current",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    res.json({
      id: req.user.id,
      name: req.user.name,
      email: req.user.email
    });
  }
);

module.exports = router;
