let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);
module.exports = function (app) {
    describe('Point de service request test', () => {
        before(function (done) { //Empty the service table before beginning the tests
            chai.request(app)
                .del('/pointservice/wipe')
                .end((err, res) => {
                    done();
                });
        }
        )
        it('TEST: Point de Service creation success', (done) => {
            let body = {
                pointService: {
                    email: "test@service.com",
                    name: "testptservice",
                    phone: "123456789",
                    fax: "111111111",
                    nocivique: "1234",
                    street: "test",
                    city: "cioty",
                    province: "QC",
                    postalcode: "k2k2k2"
                }
            }

            chai.request(app)
                .post('/pointservice/create')
                .send(body)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('Message');
                    done();
                });
        });

        it('TEST: Get points de services', (done) => {
            chai.request(app)
                .get('/pointservices')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('rows');
                    done();
                });
        });

        it('TEST: Point de Service update', (done) => {
            let body = {
                pointService: {
                    email: "testptservicezz@service.com",
                    name: "testptservicezz",
                    phone: "12222789",
                    fax: "111222111",
                    nocivique: "1214",
                    street: "twst",
                    city: "ciowty",
                    province: "WC",
                    postalcode: "k222k2"
                }
            }
            chai.request(app)
                .put('/pointservice/update')
                .send(body)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('Message');
                    done();
                });
        });

        it('TEST: Point de service get by invalid email', (done) => {
            chai.request(app)
                .get('/pointservice/test@test.com')
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });

        it('TEST: Point de Service delete', (done) => {
            chai.request(app)
                .delete('/pointservice/delete/1')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('Message');
                    done();
                });
        });
        it('TEST: Point de Service clear table', (done) => {
            chai.request(app)
                .del('/pointservice/wipe')
                .end((err, res) => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('Message');
                    done();
                });
        });
    })
}