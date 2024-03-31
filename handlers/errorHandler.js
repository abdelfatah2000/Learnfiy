const { StatusCodes } = require('http-status-codes');

exports.ErrorHandler = (error, req, res, next) => {
  console.log('Middleware Error Hadnling');
  const errStatus = err.statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
  const errMsg = err.message || 'Something went wrong';
  res.status(errStatus).json({
    success: false,
    status: errStatus,
    message: errMsg,
    stack: process.env.NODE_ENV === 'development' ? err.stack : {},
    result: null,
  });
  console.log(err);
};

exports.NotFoundHandler = (req, res, next) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: "Route doesn't exist ",
    result: null,
  });
};

exports.DevelopmentErrors = (error, req, res, next) => {
  error.stack = error.stack || '';
  const errorDetails = {
    message: error.message,
    status: error.status,
    stackHighlighted: error.stack.replace(
      /[a-z_-\d]+.js:\d+:\d+/gi,
      '<mark>$&</mark>'
    ),
  };

  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: error.message,
    error: error,
  });
};

exports.ProductionErrors = (error, req, res, next) => {
  return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: error.message,
    error: error,
  });
};
