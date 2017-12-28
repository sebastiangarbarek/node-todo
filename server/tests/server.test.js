var chai = require('chai');
var chaiHttp = require('chai-http');

var app = require('./../server');
var Todo = require('./../models/todo');

var should = chai.should();
chai.use(chaiHttp);

describe('POST /api/todo', () => {
  beforeEach((done) => {
    var todo = new Todo({
      task: 'Test this'
    });
    todo.save((err) => {
      if (err) return done(err);
      done();
    });
  });

  it('should not add an empty todo', (done) => {
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
