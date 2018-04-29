const Validator = require("validator");
const isEmpty = require("./is-empty");

// This is for validating React forms

module.exports = function validateExperienceInput(data) {
  let errors = {};
  // Data.name comes from the user.js
  // IsEmpty This checks whether what type of data this data is
  // and if there is nothing, it return an empty string

  data.title = !isEmpty(data.title) ? data.title : "";
  data.company = !isEmpty(data.company) ? data.company : "";
  data.from = !isEmpty(data.from) ? data.from : "";

  // This validates the name  length and if there is a name
  //  data comes from function above, that is passed from the user.js

  if (Validator.isEmpty(data.title)) {
    errors.title = "Job title field is required";
  }
  if (Validator.isEmpty(data.company)) {
    errors.company = "Company field is required";
  }
  if (Validator.isEmpty(data.from)) {
    errors.from = "From date field is required";
  }

  return {
    errors: errors,
    isValid: isEmpty(errors)
  };
};
