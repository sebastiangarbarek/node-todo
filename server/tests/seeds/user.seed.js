const ObjectID = require('mongodb').ObjectID;
const jwt = require('jsonwebtoken');

var User = require('./../../models/user');

const sebastian = new ObjectID();

const seedUsers = [{
  _id: sebastian,
  email: 'sebastian@test.com',
  password: 'password',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: sebastian, access: 'auth'}, 'secret').toString()
  }]
}];

const populateUsers = (done) => {
  User.remove({}).then(() => {
    toPromise = [];

    // Can't use insertMany() here as we need to hash the passwords.
    for (let user of seedUsers) {
      toPromise.push(new User(user).save());
    }

    return Promise.all(toPromise);
  }).then(() => done());
};

module.exports = {seedUsers, populateUsers};
