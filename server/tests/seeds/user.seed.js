const ObjectID = require('mongodb').ObjectID;
const jwt = require('jsonwebtoken');

var User = require('./../../models/user');

const user1Id = new ObjectID();
const user2Id = new ObjectID();

const seedUsers = [{
  _id: user1Id,
  email: '1@test.com',
  password: 'password',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: user1Id, access: 'auth'}, 'secret').toString()
  }]
}, {
  _id: user2Id,
  email: '2@test.com',
  password: 'password'
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
