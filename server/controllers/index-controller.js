const _ = require('lodash');

var User = require('../models/user');

exports.getHome = (req, res) => {
  res.send(req.user);
};

exports.postJoin = (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);
  var user = new User(body);

  user.save().then(() => {
    return user.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(user);
  }).catch((err) => {
    if (err.code === 11000) {
      res.setHeader('Content-Type', 'application/json');
      res.status(400).send(JSON.stringify({
        error: 'Email already registered'
      }));
    } else {
      res.status(400).send();
    }
  });
};

exports.postLogin = (req, res) => {
  var body = _.pick(req.body, ['email', 'password']);

  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);

      // TODO: Send user todos.

    });
  }).catch((err) => {
    res.status(400).send();
  });
};

exports.deleteLogout = (req, res) => {
  req.user.removeAuthToken(req.token).then(() => {
    res.status(200).send();
  }).catch((err) => {
    res.status(400).send();
  });
};
