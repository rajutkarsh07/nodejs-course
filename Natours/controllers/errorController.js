const AppError = require('./../utils/appError');

const handleCastError = (err) => {
  const msg = `Invalid ${err.path} : ${err.value}`;
  return new AppError(msg, 400);
};

const handleDuplicateFields = (err) => {
  // expression to match text between quotes /(["'])(\\?.)*?\1/
  // const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  // const msg = `Duplicate Field value :  ${value} . Enter another value`;

  const msg = `Duplicate Field value. Enter another value`;
  return new AppError(msg, 400);
};

const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map((e) => e.message); // to get all the errors
  const msg = `Invalid input data. ${errors.join('. ')}`;
  return new AppError(msg, 400);
};

//function for error msg for developer
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
    error: err,
    stack: err.stack,
  });
};

//function for error msg for production
const sendErrorProd = (err, res) => {
  //known error msg
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  }
  //unknown error msg
  else {
    console.error('error', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong',
    });
  }
};

module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  //error msg for us
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, res);
  }

  //error msg for client
  else if (process.env.NODE_ENV == 'production') {
    let error = { ...err };

    if (err.name === 'CastError') {
      error = handleCastError(error);
    }

    if (err.code === 11000) {
      error = handleDuplicateFields(error);
    }

    if (err.name === 'ValidationError') {
      error = handleValidationError(error);
    }

    sendErrorProd(error, res);
  }
};
