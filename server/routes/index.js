"use strict";

const express = require('express');
const router = express.Router();
const indexController = require('../controllers/indexController');

router.get('/', indexController.index);

// router.get("/", function(req, res) {
//     res.send('Hello World');
// })

// router.get("/about", function(req, res) {
//     res.send('About Page!')
// })

module.exports = router