const express = require('express');
const router = express.Router();
const bdd = require('../config/bdd');
const jwt = require('jsonwebtoken');
const auth = require('../Middleware/auth');

module.exports = router;