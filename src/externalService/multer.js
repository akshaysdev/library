const multer = require('multer');

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.split('/')[0] === 'text' && file.mimetype.split('/')[1] === 'csv') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

/* Creating a middleware function that will be used to upload images. */
const uploadImage = multer({ storage, fileFilter });

module.exports = { uploadImage };
