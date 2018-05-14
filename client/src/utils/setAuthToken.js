import axios from "axios";

// Use Axios to always set token to the header
const setAuthToken = token => {
  if (token) {
    // Apply to every request
    axios.defaults.headers.common["Authorization"] = token;
  } else {
    // Delete auth Header
    delete axios.defaults.headers.common["Authorization"];
  }
};

export default setAuthToken;
