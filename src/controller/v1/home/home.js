const { errorResponse } = require('../../../responses/response');
const { viewsFilePath, pagePath } = require('../../../constants');

const homePage = (req, res) => {
  try {
    const message = req.flash('message');
    res.render(viewsFilePath.home, { message });
  } catch (error) {
    errorResponse(error, req, res, pagePath.home);
  }
};

module.exports = { homePage };
