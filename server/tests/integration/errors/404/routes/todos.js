const chai = require('chai');
const chaiHttp = require('chai-http');
const ObjectID = require('mongodb').ObjectID;

var {seedUsers, seedTodos} = require('../../../seeds/user+todo');

var should = chai.should();
chai.use(chaiHttp);

exports.test = (server) => {
  describe('GET /todos/:id', () => {
    it('should respond with 404 if the todo is not found', (done) => {
      var hexId = new ObjectID().toHexString();

      chai.request(server)
        .get(`/todos/${hexId}`)
        .set('x-auth', seedUsers[0].tokens[0].token)
        .end((err, res) => {
          res.should.have.status(404);

          done();
        });
    });

    it('should respond with 404 to an invalid id', (done) => {
      chai.request(server)
        .get('/todos/1')
        .set('x-auth', seedUsers[0].tokens[0].token)
        .end((err, res) => {
          res.should.have.status(404);

          done();
        });
    });

    it('should respond with 404 if the todo does not belong to the user', (done) => {
      chai.request(server)
        .get(`/todos/${seedTodos[1]._id.toHexString()}`)
        .set('x-auth', seedUsers[0].tokens[0].token)
        .end((err, res) => {
          res.should.have.status(404);

          done();
        });
    });
  });

  describe('DELETE /todos/:id', () => {
    it('should respond with 404 if the todo is not found', (done) => {
      var hexId = new ObjectID().toHexString();

      chai.request(server)
        .delete(`/todos/${hexId}`)
        .set('x-auth', seedUsers[0].tokens[0].token)
        .end((err, res) => {
          res.should.have.status(404);

          done();
        });
    });

    it('should respond with 404 to an invalid id', (done) => {
      chai.request(server)
        .delete('/todos/1')
        .set('x-auth', seedUsers[0].tokens[0].token)
        .end((err, res) => {
          res.should.have.status(404);

          done();
        });
    });

    it('should respond with 404 if the todo does not belong to the user', (done) => {
      var hexId = seedTodos[1]._id.toHexString();

      chai.request(server)
        .delete(`/todos/${hexId}`)
        .set('x-auth', seedUsers[0].tokens[0].token)
        .end((err, res) => {
          res.should.have.status(404);

          done();
        });
    });
  });

  describe('PATCH /todos/:id', () => {
    it('should respond with 404 if the todo does not belong to the user', (done) => {
      var hexId = seedTodos[1]._id.toHexString();
      var task = 'Update this';

      chai.request(server)
        .patch(`/todos/${hexId}`)
        .set('x-auth', seedUsers[0].tokens[0].token)
        .send({task})
        .end((err, res) => {
          res.should.have.status(404);

          done();
        });
    });
  });
};
