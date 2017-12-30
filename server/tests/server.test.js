const chai = require('chai');
const chaiHttp = require('chai-http');

var app = require('./../server');
var Todo = require('./../models/todo');
var User = require('./../models/user');
var {
  seedUsers,
  seedTodos,
  populate
} = require('./seeds/user+todo');

var should = chai.should();
chai.use(chaiHttp);

describe('todo', () => {
  beforeEach(populate);

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
  beforeEach(populate);

  describe('GET /home', () => {
    it('should respond with the user if authenticated', (done) => {
      chai.request(app)
        .get('/home')
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
        .get('/home')
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

            done();
          }).catch((err) => done(err));
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

  describe('POST /login', () => {
    it('should login and return an auth token', (done) => {
      chai.request(app)
        .post('/login')
        .send({
          email: seedUsers[1].email,
          password: seedUsers[1].password
        })
        .end((err, res) => {
          if (err) return done(err);

          res.should.have.status(200);
          res.headers['x-auth'].should.exist;

          User.findById(seedUsers[1]._id).then((user) => {
            user.tokens[0].should.include({
              access: 'auth',
              token: res.headers['x-auth']
            });

            done();
          }).catch((err) => done(err));
        });
    });

    it('should reject an invalid login attempt', (done) => {
      chai.request(app)
        .post('/login')
        .send({
          email: seedUsers[1].email,
          password: seedUsers[1].password + 'invalid'
        })
        .end((err, res) => {
          res.should.have.status(400);
          should.not.exist(res.headers['x-auth']);

          User.findById(seedUsers[1]._id).then((user) => {
            user.tokens.should.have.lengthOf(0);

            done();
          }).catch((err) => done(err));
        });
    });
  });

  describe('DELETE /logout', () => {
    it('should remove user auth token on user logout', (done) => {
      chai.request(app)
        .delete('/logout')
        .set('x-auth', seedUsers[0].tokens[0].token)
        .end((err, res) => {
          if (err) return done(err);

          res.should.have.status(200);

          User.findById(seedUsers[0]._id).then((user) => {
            user.tokens.should.have.lengthOf(0);

            done();
          }).catch((err) => done(err));
        });
    });
  });

  afterEach((done) => {
    User.remove({}).then(() => done());
  });
});
