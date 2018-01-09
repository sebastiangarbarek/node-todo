var PrettyError = require('../helpers/PrettyError');

exports.mongoErrorHandler = (err, req, res, next) => {
  if (err.name == 'MongoError') {
    switch (err.code) {
      case 11000: {
        res.setHeader('Content-Type', 'application/json');

        if (err.errmsg.includes('email')) {
          res.status(400).send(new PrettyError(err.name, 'ERR_EXISTS', 'Email already registered'));
        } else if (err.errmsg.includes('username')) {
          res.status(400).send(new PrettyError(err.name, 'ERR_EXISTS', 'Username taken'));
        } else {
          res.status(400).send(new PrettyError(err.name, 'ERR_EXISTS', 'Duplicate key'));
        }

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
      errorMessages.errors.push(new PrettyError('MongooseError', 'ERR_' + key.toUpperCase(), err.errors[key].message));
    });

    res.setHeader('Content-Type', 'application/json');
    res.status(400).send(errorMessages);
  } else {
    next(err);
  }
}

exports.userErrorHandler = (err, req, res, next) => {
  if (err.errorName === 'UserError') {
    res.setHeader('Content-Type', 'application/json');
    res.status(400).send(err);
  } else {
    next(err);
  }
}

exports.errorHandler = (err, req, res, next) => {
  console.log(err);

  res.status(500).send(err);
}
