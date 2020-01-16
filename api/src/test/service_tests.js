let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

module.exports = function (app) {
    describe('Service request test', () => {
        before(function (done) { //Empty the service table before beginning the tests
            chai.request(app)
                .del('/service/wipe')
                .end((err, res) => {
                    done();
                });
        }
        )
        it('TEST: Service creation success', (done) => {
            let body = {
                service: {
                    name: "Nettoyage",
                    description: "Nettoyage apres sinistre",
                    tarifParent: "150",
                    tarifSubventionner: "65",
                    tarifCISSS: "30",
                    state: "0"
                }
            }

            chai.request(app)
                .post('/service/create')
                .send(body)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('Message');
                    done();
                });
        });

        it('TEST: Service creation, already created with same name error', (done) => {
            let body = {
                service: {
                    name: "Nettoyage",
                    description: "Nettoyage apres sinistre",
                    tarifParent: "150",
                    tarifSubventionner: "65",
                    tarifCISSS: "30",
                    state: "0"
                }
            }
            chai.request(app)
                .post('/service/create')
                .send(body)
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });

        it('TEST: Service update', (done) => {
            let body = {
                service: {
                    name: "Nettoyage",
                    description: "Nettoyage apres sinistre",
                    tarifParent: "150",
                    tarifSubventionner: "65",
                    tarifCISSS: "30",
                    state: "0"
                }
            }
            chai.request(app)
                .put('/service/update')
                .send(body)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('Message');
                    done();
                });
        });

        it('TEST: Service get by name returns service', (done) => {
            let body = {
                service: {
                    name: 'Nettoyage'
                }
            }
            chai.request(app)
                .get('/service/' + body.service.name)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('service');
                    done();
                });
        });

        it('TEST: Service get by name with invalid name returns error', (done) => {
            let body = {
                service: {
                    name: 'Nezzze'
                }
            }
            chai.request(app)
                .get('/service/' + body.service.name)
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });


        it('TEST: Service get all Services', (done) => {
            let body = {
                service: {
                    name: 'Nettoyage'
                }
            }
            chai.request(app)
                .get('/services')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('rows');
                    done();
                })
        })

        it('TEST: Service delete', (done) => {
            chai.request(app)
                .delete('/service/delete/1')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('Message');
                    done();
                });
        });

        it('TEST: Service clear table', (done) => {
            chai.request(app)
                .delete('/service/wipe')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('Message');
                    done();
                });
        });
    })
}
