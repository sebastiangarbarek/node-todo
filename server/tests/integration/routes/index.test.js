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

describe('user', () => {
  beforeEach(populate);

  describe('GET /', () => {
    it('should respond with the user if authenticated', (done) => {
      chai.request(server)
        .get('/')
        .set('x-auth', seedUsers[0].tokens[0].token)
        .end((err, res) => {
          res.should.have.status(200);
          res.body._id.should.equal(seedUsers[0]._id.toHexString());
          res.body.email.should.equal(seedUsers[0].email);

          done();
        });
    });

    shared.unauthorized(server, '/', 'get');
  });

  describe('POST /join', () => {
    it('should add a new user and their password should be hashed', (done) => {
      var req = {
        email: 'test@test.com',
        password: 'password'
      };

      chai.request(server)
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

    it('should respond with the correct error if the email is invalid', (done) => {
      chai.request(server)
        .post('/join')
        .send({
          email: 'invalid',
          password: 'password'
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.errors[0].errorMessage.should.equal('invalid is not a valid email');

          done();
        });
    });

    it('should respond with the correct error if the email is missing', (done) => {
      chai.request(server)
        .post('/join')
        .send({
          password: 'password'
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.errors[0].errorMessage.should.equal('An email is required');

          done();
        });
    });

    it('should respond with the correct error if the password is missing', (done) => {
      chai.request(server)
        .post('/join')
        .send({
          email: seedUsers[1].email
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.errors[0].errorMessage.should.equal('A password is required');

          done();
        });
    });

    it('should respond with two error messages if two fields are missing', (done) => {
      chai.request(server)
        .post('/join')
        .send({})
        .end((err, res) => {
          res.should.have.status(400);
          res.body.errors.should.have.lengthOf(2);

          done();
        });
    });

    it('should not add a user if the email has already been verified', (done) => {
      chai.request(server)
        .post('/join')
        .send({
          email: seedUsers[0].email,
          password: 'password'
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.errorMessage.should.equal('Duplicate key');

          done();
        });
    });
  });

  describe('POST /login', () => {
    it('should login and return an auth token', (done) => {
      chai.request(server)
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
      chai.request(server)
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
      chai.request(server)
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

    shared.unauthorized(server, '/logout', 'delete');
  });

  afterEach((done) => {
    User.remove({}).then(() => done());
  });
});

after(done => {
  server.close(() => {
    connect.models = {};
    connect.modelSchemas = {};
    connect.connection.close(done);
  });
});
