var formattedError = (code, msg) => {
  return {
    errorCode: code,
    errorMessage: msg
  }
}

exports.mongoErrorHandler = (err, req, res, next) => {
  if (err.name == 'MongoError') {
    switch (err.code) {
      case 11000: {
        res.setHeader('Content-Type', 'application/json');
        res.status(400).send(formattedError(400, 'Duplicate key'));
        break;
      }
      default: {
        next(err);
      }
    }
  } else {
    next(err);
  }
}

exports.mongooseErrorHandler = (err, req, res, next) => {
  if (err.errors) {
    var errorMessages = {
      errors: []
    };

    Object.keys(err.errors).forEach((key) => {
      errorMessages.errors.push(formattedError(400, err.errors[key].message));
    });

    res.setHeader('Content-Type', 'application/json');
    res.status(400).send(errorMessages);
  }
}

exports.errorHandler = (err, req, res, next) => {
  res.status(500).send(err);
}
