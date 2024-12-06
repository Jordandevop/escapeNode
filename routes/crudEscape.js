const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bdd = require("../config/bdd");
const auth = require("../Middleware/auth");

module.exports = router;
