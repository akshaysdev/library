const express = require('express');

const homeRouter = express.Router();
const home = require('./home');

homeRouter.get('/', home.homePage);

module.exports = { homeRouter };
