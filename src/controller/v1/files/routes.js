const express = require('express');

const fileRouter = express.Router();
const file = require('./file');

const { container } = require('../../../utils/dependencyInjection');
const uploadImage = container.resolve('uploadImage');

// Upload forms
fileRouter.get('/upload/form', file.uploadForm);

fileRouter.post('/upload', uploadImage.single('file'), file.uploadFile);

// Download forms
fileRouter.get('/download/form', file.downloadForm);

fileRouter.post('/download', file.downloadFile);



module.exports = { fileRouter };
