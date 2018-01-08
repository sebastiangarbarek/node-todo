const _ = require('lodash');

var User = require('../models/User');

exports.getIndex = (req, res, next) => {
  // TODO: Send user todos.

  res.send(req.user);
};

exports.postJoin = (req, res, next) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((err) => {
    next(err);
  });
};

exports.postLogin = (req, res, next) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);

      // TODO: Send user todos.
    });
  }).catch((err) => {
    next(err);
  });
};

exports.deleteLogout = (req, res, next) => {
  req.user.removeAuthToken(req.token).then(() => {
    res.status(200).send();
  }).catch((err) => {
    next(err);
  });
};

exports.getInvites = (req, res, next) => {

}

exports.deleteInvite = (req, res, next) => {

}
