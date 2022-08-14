const errorResponse = (error, req, res, isFile = false, redirectRoute) => {
  const text = error.status ? error.message : isFile ? 'File format not supported' : 'Internal server error';
  req.flash('message', { text, status: 'error' });
  res.redirect(redirectRoute);
};

const successResponse = (message, req, res, redirectRoute) => {
  req.flash('message', { text: message.text, status: message?.status ? message.status : 'success' });
  res.redirect(redirectRoute);
};

module.exports = { errorResponse, successResponse };
