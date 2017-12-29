const chai = require('chai');
const chaiHttp = require('chai-http');

var app = require('./../server');
var Todo = require('./../models/todo');
var User = require('./../models/user');
var {seedTodos, populateTodos} = require('./seeds/todo.seed.js');
var {seedUsers, populateUsers} = require('./seeds/user.seed.js');

var should = chai.should();
chai.use(chaiHttp);

describe('todo', () => {
  beforeEach(populateTodos);

  describe('GET /todo', () => {
    it('should respond with all todos in the database', (done) => {
      chai.request(app)
        .get('/todo')
        .end((err, res) => {
          res.body.todos.should.have.lengthOf(seedTodos.length);

          done();
        });
    });
  });

  describe('POST /todo', () => {
    it('should not add an empty todo to the database', (done) => {
      chai.request(app)
        .post('/todo')
        .send({})
        .end((err, res) => {
          Todo.find().then((databaseTodos) => {
            databaseTodos.should.have.lengthOf(seedTodos.length);
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
    it('should respond with the user if authenticated', (done) => {
      chai.request(app)
        .get('/user/me')
        .set('x-auth', seedUsers[0].tokens[0].token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body._id.should.equal(seedUsers[0]._id.toHexString());
          res.body.email.should.equal(seedUsers[0].email);

          done();
        });
    });

    it('should respond with an error if unauthenticated', (done) => {
      chai.request(app)
        .get('/user/me')
        .end((err, res) => {
          res.should.have.status(401);
          res.body.should.deep.equal({});

          done();
        });
    });
  });

  describe('POST /join', () => {
    it('should add a new user', (done) => {
      var req = {
        email: 'test@test.com',
        password: 'password'
      };

      chai.request(app)
        .post('/join')
        .send(req)
        .end((err, res) => {
          if (err) return done(err);

          res.should.have.status(200);
          res.headers['x-auth'].should.exist;
          res.body._id.should.exist;
          res.body.email.should.exist;

          // Wrap the email in an object for findOne().
          var email = req.email;
          User.findOne({email}).then((user) => {
            user.should.exist;
            user.password.should.not.equal(req.password);
          });

          done();
        });
    });

    it('should return a validation error if the join request was invalid', (done) => {
      chai.request(app)
        .post('/join')
        .send({
          email: 'invalid',
          password: 'password'
        })
        .end((err, res) => {
          res.should.have.status(400);

          done();
        });
    });

    it('should not add a user if the email has already been validated', (done) => {
      chai.request(app)
        .post('/join')
        .send({
          email: seedUsers[0].email,
          password: 'password'
        })
        .end((err, res) => {
          res.should.have.status(400);

          done();
        });
    });
  });

  afterEach((done) => {
    User.remove({}).then(() => done());
  });
});
