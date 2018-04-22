const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load Profile model from models/Profile.js
const profile = require("../models/Profile");
// Load User model from models/User.js
const User = require("../models/User");

// @route   /api/profile/test
// @desc    Tests profile route
// access   Public
router.get("/test", (req, res) => res.json({ msg: "Profile Works" }));

// @route   /api/profile/test
// @desc    Tests profile route
// access   Public
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    // Since this is a protected route we will search for the user id
    // that is loged in
    Profile.findOne({ user: req.user.id })
      .then(profile => {
        // If there is no profile return this:
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        // If there is a profile, return the Profile from models/Profile
        res.json(profile);
      })
      // If there is an error, return the error in json format
      .catch(err => res.status(404).json(err));
  }
);

module.exports = router;
