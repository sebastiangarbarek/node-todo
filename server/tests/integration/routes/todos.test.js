const http = require('http');
const chai = require('chai');
const chaiHttp = require('chai-http');

var {app, connect} = require('../../../app');
var Todo = require('../../../models/Todo');
var {seedUsers, seedTodos, populate} = require('../seeds/basic');

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
          res.body.todo.task.should.equal(task);

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
  });

  describe('GET /todos/:id', () => {
    it('should respond with the todo of the id', (done) => {
      chai.request(server)
        .get(`/todos/${seedTodos[0]._id.toHexString()}`)
        .set('x-auth', seedUsers[0].tokens[0].token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.todo.task.should.equal(seedTodos[0].task);

          done();
        });
    });
  });

  describe('DELETE /todos/:id', () => {
    it('should delete the todo of the id', (done) => {
      var hexId = seedTodos[0]._id.toHexString();

      chai.request(server)
        .delete(`/todos/${hexId}`)
        .set('x-auth', seedUsers[0].tokens[0].token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.todo._id.should.equal(hexId);

          done();
        });
    });
  });

  describe('PATCH /todos/:id', () => {
    it('should update the todo task of the id', (done) => {
      var hexId = seedTodos[0]._id.toHexString();
      var task = 'Update this';

      chai.request(server)
        .patch(`/todos/${hexId}`)
        .set('x-auth', seedUsers[0].tokens[0].token)
        .send({task})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.todo.task.should.equal(task);

          done();
        });
    });

    it('should update the done timestamp if not done', (done) => {
      var hexId = seedTodos[0]._id.toHexString();

      chai.request(server)
        .patch(`/todos/${hexId}`)
        .set('x-auth', seedUsers[0].tokens[0].token)
        .send({done: false})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.todo.done.should.equal(false);
          should.not.exist(res.body.todo.doneAt);

          done();
        });
    });

    it('should update the done timestamp if done', (done) => {
      var hexId = seedTodos[0]._id.toHexString();

      chai.request(server)
        .patch(`/todos/${hexId}`)
        .set('x-auth', seedUsers[0].tokens[0].token)
        .send({done: true})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.todo.done.should.equal(true);
          res.body.todo.doneAt.should.be.a('number');

          done();
        });
    });
  });

  afterEach((done) => {
    Todo.remove({}).then(() => done());
  });
});

after(done => {
  server.close(() => {
    connect.connection.close(done);
  });
});
