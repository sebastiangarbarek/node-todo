var User = require('./../models/user');

var authenticate = (req, res, next) => {
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

module.exports = authenticate;
