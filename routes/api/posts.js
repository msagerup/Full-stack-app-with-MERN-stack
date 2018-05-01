const express = require("express");
const mongoose = require("mongoose");
const passport = require("passport");
const router = express.Router();

// Bring in Validator
const validatePostInput = require("../../validation/post");

// Bring in the post model Schema
const Post = require("../models/post");

// @route   /api/post/test
// @desc    Tests post route
// access   Public
router.get("/test", (req, res) => res.json({ msg: "Posts Works" }));

// @route  POST /api/posts
// @desc    Create post
// access   Private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    // Put in validation
    const { errors, isValid } = validatePostInput(req.body);

    // Check Validationif
    if (!isValid) {
      // If any errors, send 400 with errors object
      return res.status(400).json(errors);
    }

    const newPost = new Post({
      text: req.body.text,
      name: req.body.name,
      avatar: req.body.avatar,
      user: req.user.id
    });

    newPost.save().then(post => res.json(post));
  }
);

module.exports = router;
