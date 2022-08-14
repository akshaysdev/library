const express = require('express');

const fileRouter = express.Router();
const file = require('./file');

const { container } = require('../../../externalService/dependencyInjection');
const uploadImage = container.resolve('uploadImage');

// Get forms
fileRouter.get('/upload', file.uploadForm);

// fileRouter.get('/download', file.uploadForm);

fileRouter.post('/upload', uploadImage.single('file'), file.uploadFile);


module.exports = { fileRouter };
