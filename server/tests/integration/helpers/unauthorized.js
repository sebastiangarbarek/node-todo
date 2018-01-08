const chai = require('chai');
const chaiHttp = require('chai-http');

var should = chai.should();
chai.use(chaiHttp);

exports.test = (server, route, type) => {
  it(`should respond with a 401 if not logged in for ${type.toUpperCase()} ${route}`, (done) => {
    switch (type) {
      case 'get': {
        chai.request(server).get(route).end((err, res) => {
          res.should.have.status(401); res.body.should.deep.equal({}); done();
        });
        break;
      }
      case 'delete': {
        chai.request(server).delete(route).end((err, res) => {
          res.should.have.status(401); res.body.should.deep.equal({}); done();
        });
        break;
      }
      case 'post': {
        chai.request(server).post(route).end((err, res) => {
          res.should.have.status(401); res.body.should.deep.equal({}); done();
        });
        break;
      }
      case 'patch': {
        chai.request(server).patch(route).end((err, res) => {
          res.should.have.status(401); res.body.should.deep.equal({}); done();
        });
      }
    }
  });
}
