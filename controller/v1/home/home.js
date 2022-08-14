const { response } = require('../../../responses/response');
const { viewsFilePath } = require('../../../constants');

const homePage = (req, res) => {
  try {
    const message = req.flash('message');
    res.render(viewsFilePath.home, { message });
  } catch (error) {
    res.status(error.status || 500).json(response(error));
  }
};

module.exports = { homePage };
