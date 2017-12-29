const chai = require('chai');
const chaiHttp = require('chai-http');

var app = require('./../server');
var Todo = require('./../models/todo');
var {todos, populateTodos} = require('./seeds/todo.seed.js');
var {users, populateUsers} = require('./seeds/user.seed.js');

var should = chai.should();
chai.use(chaiHttp);

describe('todo', () => {
  beforeEach(populateTodos);

  describe('GET /todo', () => {
    it('should retrieve all todos', (done) => {
      chai.request(app)
        .get('/todo')
        .end((err, res) => {
          res.body.todos.should.have.lengthOf(todos.length);
          done();
        });
    });
  });

  describe('POST /todo', () => {
    it('should not add an empty todo', (done) => {
      chai.request(app)
        .post('/todo')
        .send({})
        .end((err, res) => {
          Todo.find().then((todos) => {
            todos.should.be.empty;
          }).catch((err) => done(err));
          done();
        });
    });

    it('should respond with an error to an empty todo', (done) => {
      chai.request(app)
        .post('/todo')
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          done();
        });
    });
  });

  afterEach((done) => {
    Todo.remove({}).then(() => done());
  });
});

describe('user', () => {
  beforeEach(populateUsers);

  describe('GET /user/me', () => {

  });

  describe('POST /join', () => {

  });

  afterEach((done) => {
    User.remove({}).then(() => done());
  });
});
