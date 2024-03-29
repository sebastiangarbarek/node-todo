const ObjectID = require('mongodb').ObjectID;
const jwt = require('jsonwebtoken');

var Todo = require('../../../models/Todo');
var User = require('../../../models/User');

const sebastian = new ObjectID();
const andrew = new ObjectID();

const seedUsers = [{
  _id: sebastian,
  username: 'seba',
  email: 'sebastian@test.com',
  password: 'password',
  tokens: [{
    access: 'auth',
    token: jwt.sign({_id: sebastian, access: 'auth'}, process.env.JWT_SECRET).toString()
  }]
}, {
  _id: andrew,
  username: 'andy',
  email: 'andrew@test.com',
  password: 'password',
}];

const seedTodos = [{
  _id: new ObjectID(),
  task: 'Test GET',
  completed: true,
  completedAt: 1,
  _creator: sebastian
}, {
  _id: new ObjectID(),
  task: 'Test POST',
  _creator: andrew
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

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(seedTodos);
  }).then(() => done());
};

const populate = (done) => {
  populateUsers(() => {
    populateTodos(() => done());
  });
};

module.exports = {seedUsers, seedTodos, populate};
