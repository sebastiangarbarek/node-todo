const http = require('http');
const chai = require('chai');
const chaiHttp = require('chai-http');

var {app, connect} = require('../../../app');
var User = require('../../../models/User');
var {seedUsers, populate} = require('../seeds/basic');

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
  });

  describe('POST /join', () => {
    it('should add a new user and their password should be hashed', (done) => {
      var req = {
        username: 'test',
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
  });

  afterEach((done) => {
    User.remove({}).then(() => done());
  });
});

after(done => {
  server.close(() => {
    connect.connection.close(done);
  });
});
