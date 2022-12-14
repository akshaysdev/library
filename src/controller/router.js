const express = require('express');
const createError = require('http-errors');

const v1Routes = require('./v1/v1Routes');

/**
 * It creates a new router, and then uses that router to handle all requests to the /api path
 * @param app - The express app
 */
const router = (app) => {
  const apiRoutes = express.Router();

  apiRoutes.use('/v1', v1Routes);

  apiRoutes.use((req, res, next) => {
    if (!req.route) {
      res.redirect('/api/v1/home');
    }

    return next();
  });

  app.use('/api', apiRoutes);
};

module.exports = router;
