const { errorResponse, successResponse } = require('../../../responses/response');
const { viewsFilePath, pagePath } = require('../../../constants');
const { fileService } = require('../../../service/service');

const uploadForm = (req, res) => {
  try {
    const message = req.flash('message');
    res.render(viewsFilePath.upload, { message });
  } catch (error) {
    errorResponse(error, req, res, pagePath.uploadForm);
  }
};

const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      const error = new Error('No file was uploaded.');
      error.status = 400;
      throw error;
    }

    const message = await fileService.saveDataToFile(req.body.type, req.file);

    successResponse(message, req, res, pagePath.uploadForm);
  } catch (error) {
    errorResponse(error, req, res, error.status ? false : true, pagePath.uploadForm);
  }
};

const downloadForm = (req, res) => {
  try {
    const message = req.flash('message');
    res.render(viewsFilePath.upload, { message });
  } catch (error) {
    errorResponse(error, req, res, pagePath.uploadForm);
  }
};

// const uploadFile = async (req, res) => {
//   try {
//     if (!req.file) {
//       const error = new Error('No file was uploaded.');
//       error.status = 400;
//       throw error;
//     }

//     const message = await fileService.saveDataToFile(req.body.type, req.file);

//     successResponse(message, req, res, pagePath.uploadForm);
//   } catch (error) {
//     errorResponse(error, req, res, error.status ? false : true, pagePath.uploadForm);
//   }
// };

module.exports = { uploadForm, uploadFile };
