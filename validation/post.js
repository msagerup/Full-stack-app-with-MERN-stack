const Validator = require("validator");
const isEmpty = require("./is-empty");

// This is for validating React forms

module.exports = function validatePostInput(data) {
  let errors = {};
  // Data.name comes from the user.js
  // This checks whether what type of data this data is
  // and if there is nothing, it return an empty string

  data.text = !isEmpty(data.text) ? data.text : "";

  // This validates the name  length and if there is a name
  //  data comes from function above, that is passed from the user.js

  if (!Validator.isLength(data.text, { min: 10, max: 300 })) {
    errors.text = "Post must be between 10 and 300 characters";
  }

  if (Validator.isEmpty(data.text)) {
    errors.text = "Text field is required";
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};
