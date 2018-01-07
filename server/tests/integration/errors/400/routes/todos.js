const chai = require('chai');
const chaiHttp = require('chai-http');

var User = require('../../../../../models/User');
var {seedUsers} = require('../../../seeds/basic');

var should = chai.should();
chai.use(chaiHttp);

exports.test = (server) => {
  describe('POST /login', () => {
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

    it('should respond with the correct error if the email is missing', (done) => {
      chai.request(server)
        .post('/login')
        .send({
          password: 'password'
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.errorMessage.should.equal('Missing email');

          done();
        });
    });

    it('should respond with the correct error if the password is missing', (done) => {
      chai.request(server)
        .post('/login')
        .send({
          email: seedUsers[1].email
        })
        .end((err, res) => {
          res.should.have.status(400);
          res.body.errorMessage.should.equal('Missing password');

          done();
        });
    });
  });
};
