const chai = require('chai');
const chaiHttp = require('chai-http');

var app = require('../../../app');

var should = chai.should();
chai.use(chaiHttp);

exports.unauthorized = (route, type) => {
  it('should respond with 401 if not logged in', (done) => {
    switch (type) {
      case 'get': {
        chai.request(app).get(route).end((err, res) => {
          res.should.have.status(401); res.body.should.deep.equal({}); done();
        });
        break;
      }
      case 'delete': {
        chai.request(app).delete(route).end((err, res) => {
          res.should.have.status(401); res.body.should.deep.equal({}); done();
        });
      }
      case 'post': {
        chai.request(app).post(route).end((err, res) => {
          res.should.have.status(401); res.body.should.deep.equal({}); done();
        });
      }
    }
  });
}
