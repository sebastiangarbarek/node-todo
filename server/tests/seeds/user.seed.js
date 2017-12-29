const ObjectID = require('mongodb');
const jwt = require('jsonwebtoken');

var User = require('./../../models/user');

const user1Id = new ObjectID();
const user3Id = new ObjectID();

const users = [{
  _id: user1Id,
  email: '1@example.com',
  password: 'password',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: user1Id, access: 'auth'}, 'secret').toString();
  }]
}, {
  _id: user2Id,
  email: '2@example.com',
  password: 'password'
}];

const populateUsers = (done) => {
  User.remove({}).then(() => {
    toPromise = [];

    // Can't use insertMany() here as we need to hash the passwords.
    for (let user of users) {
      toPromise.push(new User(user).save());
    }

    return Promise.all(toPromise);
  }).then(() => done());
};

module.exports = {users, populateUsers};
