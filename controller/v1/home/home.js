const { response } = require('../../../responses/response');
const { viewsFilePath } = require('../../../constants');

const homePage = (req, res) => {
  try {
    res.render(viewsFilePath.home);
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};

module.exports = { homePage };
