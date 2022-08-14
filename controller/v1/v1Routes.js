const express = require('express');

const v1Routes = express.Router();

const { homeRouter } = require('./home/routes');
const { fileRouter } = require('./files/routes');
const { libraryRouter } = require('./library/routes');

v1Routes.use('/home', homeRouter);

v1Routes.use('/file', fileRouter);

v1Routes.use('/library', libraryRouter);

module.exports = v1Routes;
