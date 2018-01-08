var User = require('./../models/User');

exports.user = (req, res, next) => {
  var token = req.header('x-auth');

  User.findByToken(token).then((user) => {
    if (!user) {
      // Forces a catch.
      return Promise.reject();
    }

    req.user = user;
    req.token = token;

    // Continue the route.
    next();
  }).catch((err) => {
    res.status(401).send();
  });
};

exports.team = (req, res, next) => {

};
