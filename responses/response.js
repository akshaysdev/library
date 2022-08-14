/**
 * It takes an error object, a request object, a response object, a boolean value, and a redirect
 * route. If the error object has a status property, it sets the text variable to the error message. If
 * the isFile variable is true, it sets the text variable to 'File format not supported'. If the error
 * object does not have a status property, it sets the text variable to 'Internal server error'. It
 * then sets a flash message with the text variable and the status 'error', and redirects to the
 * redirect route
 * @param error - The error object
 * @param req - The request object
 * @param res - The response object
 * @param [isFile=false] - This is a boolean value that determines whether the error is a file error or
 * not.
 * @param redirectRoute - The route to redirect to after the error has been handled.
 */
const errorResponse = (error, req, res, isFile = false, redirectRoute) => {
  const text = error.status ? error.message : isFile ? 'File format not supported' : 'Internal server error';
  req.flash('message', { text, status: 'error' });
  res.redirect(redirectRoute);
};

/**
 * It takes a message, a request, a response, and a redirect route, and then it sets the message on the
 * request, and then it redirects to the redirect route
 * @param message - The message object that will be passed to the flash message.
 * @param req - The request object
 * @param res - The response object
 * @param redirectRoute - The route to redirect to.
 */
const successResponse = (message, req, res, redirectRoute) => {
  req.flash('message', {
    text: message.text,
    status: message?.status ? message.status : 'success',
    download: message?.download || false,
  });
  res.redirect(redirectRoute);
};

module.exports = { errorResponse, successResponse };
