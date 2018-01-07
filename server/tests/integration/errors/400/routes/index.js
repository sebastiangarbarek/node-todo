const chai = require('chai');
const chaiHttp = require('chai-http');

var {seedUsers} = require('../../../seeds/basic');

var should = chai.should();
chai.use(chaiHttp);

exports.test = (server) => {
  describe('POST /join', () => {
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
};
