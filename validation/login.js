const Validator = require("validator");
const isEmpty = require("./is-empty");

// This is for validating React forms

module.exports = function validateLoginInput(data) {
  let errors = {};
  // Data.name comes from the user.js
  // This checks whether what type of data this data is
  // and if there is nothing, it return an empty string

  data.email = !isEmpty(data.email) ? data.email : "";
  data.password = !isEmpty(data.password) ? data.password : "";

  // This validates the name  length and if there is a name
  //  data comes from function above, that is passed from the user.js

  if (Validator.isEmpty(data.email)) {
    errors.email = "Email field is required";
  }

  if (!Validator.isEmail(data.email)) {
    errors.email = "You must enter a valid email";
  }

  if (Validator.isEmpty(data.password)) {
    errors.password = "Password field is required";
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};
