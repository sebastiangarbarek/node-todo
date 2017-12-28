var chai = require('chai');
var chaiHttp = require('chai-http');

var app = require('./../server');
var Todo = require('./../models/todo');

var should = chai.should();
chai.use(chaiHttp);

describe('POST /api/todo', () => {
  beforeEach((done) => {
    Todo.remove({}).then(() => done());
  });

  it('should not add an empty todo', (done) => {
    chai.request(app)
      .post('/api/todo')
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
      .post('/api/todo')
      .send({})
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
  });

  afterEach((done) => {
    Todo.remove({}).then(() => done());
  });
});
