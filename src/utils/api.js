const axios = require("axios");

const api = axios.create({
  baseURL: "https://restful-booker.herokuapp.com",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});

module.exports = api;
