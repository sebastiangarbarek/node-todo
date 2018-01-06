const http = require('http');
const chai = require('chai');
const chaiHttp = require('chai-http');

var {app, connect} = require('../../../app');
var Todo = require('../../../models/todo');
var User = require('../../../models/user');
var {
  seedUsers,
  seedTodos,
  populate
} = require('../seeds/user+todo');
var shared = require('../common/shared');

var should = chai.should();
chai.use(chaiHttp);

var server = http.createServer(app);

describe('todo', () => {
  beforeEach(populate);

  describe('GET /todos', () => {
    it('should respond with a user\'s todos in the database', (done) => {
      chai.request(server)
        .get('/todos')
        .set('x-auth', seedUsers[0].tokens[0].token)
        .end((err, res) => {
          res.body.todos.should.have.lengthOf(1);

          done();
        });
    });

    shared.unauthorized(server, '/todos', 'get');
  });

  describe('POST /todos', () => {
    it('should create a new todo', (done) => {
      var task = 'Test this'

      chai.request(server)
        .post('/todos')
        .set('x-auth', seedUsers[0].tokens[0].token)
        .send({task})
        .end((err, res) => {
          if (err) return done(err);

          res.should.have.status(200);
          res.body.task.should.equal(task);

          Todo.find({task}).then((todos) => {
            todos.should.have.lengthOf(1);
            todos[0].task.should.equal(task);

            done();
          }).catch((err) => done(err));
        });
    });

    it('should not add an empty todo to the database', (done) => {
      chai.request(server)
        .post('/todos')
        .set('x-auth', seedUsers[0].tokens[0].token)
        .send({})
        .end((err, res) => {
          Todo.find().then((databaseTodos) => {
            databaseTodos.should.have.lengthOf(seedTodos.length);
          }).catch((err) => done(err));

          done();
        });
    });

    it('should respond with the correct error if the task is missing', (done) => {
      chai.request(server)
        .post('/todos')
        .set('x-auth', seedUsers[0].tokens[0].token)
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          res.body.errors[0].errorMessage.should.equal('A task is required');

          done();
        });
    });

    shared.unauthorized(server, '/todos', 'post');
  });

  describe('GET /todos/:id', () => {
    it('should respond with the todo of id', (done) => {
      chai.request(server)
        .get(`/todos/${seedTodos[0]._id.toHexString()}`)
        .set('x-auth', seedUsers[0].tokens[0].token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.todo.task.should.equal(seedTodos[0].task);

          done();
        });
    });

    shared.unauthorized(server, `/todos/${seedTodos[0]._id.toHexString()}`, 'get');
  });

  afterEach((done) => {
    Todo.remove({}).then(() => done());
  });
});

after(done => {
  server.close(() => {
    connect.models = {};
    connect.modelSchemas = {};
    connect.connection.close(done);
  });
});
