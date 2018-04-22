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

// @route   GET /api/profile
// @desc    Tests profile route
// access   Private
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

// @route   POST /api/profile
// @desc    Create or edit User profile
// access   Private
router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Get fields to register profile
    // Set empty object and then put the req into that object
    const profileFields = {};
    // This gets the data from the logedin user,
    // name, email, avatar
    profileFields.user = req.user.id;
    // Checks if the fields are there and puts it into the empty object above(profileFields)
    // Checking if its send in from the form(front end), if so we are setting it to the object
    if (req.body.handle) {
      profileFields.handle = req.body.handle;
    }
    // Same as above, just oneliners
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.webiste;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
    // Skills, we need to split into an array, because it is deffined as an array in the api. Profile.js
    // We want users to seperate with commas in the form. Using the split function and store them into an array,
    // Using the split function.
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }
    // Social, since its an object, we need to define that
    profileFields.social = {};

    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.instagram) profileFields.social.instagram = req.body.instagram;

    // Check to see if there is a profile allready, if there is one edit and load stuff
    Profile.fineOne({ user: req.user.id }).then(profile => {
      if (profile) {
        // If there is a profile, update fields
        Profile.findOneAndUpdate(
          // Get the user
          { user: req.user.id },
          // Fill in the fields if there is any from the profileFields object
          { $set: profileFields },
          { new: true }
        ).then(profile => res.json(profile));
      } else {
        // If there is no profile, create one

        // Check if handle exsits
        Profile.findOne({ handle: profileFields.handle }).then(profile => {
          if (profile) {
            errors.handle = "That handle already exists";
            res.status(400).json(errors);
          }
          // Save Profile
          new Profile(profileFields).save().then(profile => res.json(profile));
        });
      }
    });
  }
);

module.exports = router;
