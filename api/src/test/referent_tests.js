let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

module.exports = function (app) {
    describe('Referents request test', () => {
        before(function (done) { //Empty the referent table before beginning the tests
            chai.request(app)
                .del('/referent/wipe')
                .end((err, res) => {
                    chai.request(app)
                        .del('/referentassociation/wipe')
                        .end((err, res) => {
                            done();
                        })
                });
        }
        )
        it('TEST: Referent creation success', (done) => {
            let body = {
                referent: {
                    firstname: "TestReferent",
                    lastname: "TesterReferent",
                    email: 'user@referent.com',
                    title: 'Avocat',
                    cellPhone: "5140000000",
                    workPhone: "5141111111",
                    preferences: "0",
                    fax: "1111111112"
                }
            }
            chai.request(app)
                .post('/referent/create')
                .send(body)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('Message');
                    done();
                });
        });
        it('TEST: Referent creation, already created with same email error', (done) => {
            let body = {
                referent: {
                    firstname: "TestReferent",
                    lastname: "TesterReferent",
                    email: 'user@referent.com',
                    title: 'Referent chef',
                    cellPhone: "5140000000",
                    workPhone: "5141111111",
                    preferences: "0",
                    fax: "1111111112"
                }
            }
            chai.request(app)
                .post('/referent/create')
                .send(body)
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });
        it('TEST: Referent update', (done) => {
            let body = {
                referent: {
                    firstname: "TxstReferent",
                    lastname: "TxsterReferent",
                    email: 'user@referent.com',
                    title: 'Rxferent chef',
                    cellPhone: "5120000000",
                    workPhone: "512111111",
                    preferences: "0",
                    fax: "2222111112"
                }
            }
            chai.request(app)
                .put('/referent/update')
                .send(body)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('Message');
                    res.body.should.have.property('Email');
                    done();
                });
        });
        it('TEST: Referent association to OrganismeReferent success', (done) => {
            let body = {
                association: {
                    organismeId: "1",
                    email: 'user@referent.com'
                }
            }
            chai.request(app)
                .post('/referent/organismereferent')
                .send(body)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('Message');
                    done();
                });
        });
        it('TEST: Referent get by email returns referent', (done) => {
            let body = {
                referent: {
                    email: 'user@referent.com'
                }
            }
            chai.request(app)
                .get('/referent/' + body.referent.email)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('referent');
                    done();
                });
        });
        it('TEST: Referent get by email with invalid email returns error', (done) => {
            let body = {
                referent: {
                    email: 'noreferent@referent.com'
                }
            }
            chai.request(app)
                .get('/referent/' + body.referent.email)
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });

        it('TEST: Search referents by either nom, prenom, organisme name, title, phone number, family folder number', (done) => {
            let body = {
                query: "Organisme referent test"
            }
            chai.request(app)
                .get('/referent/search/' + body.query)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('returnedReferent');
                    done();
                });
        });

        it('TEST: Get referents with title Avocat', (done) => {
            chai.request(app)
                .get('/avocats/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('Avocats');
                    done();
                });
        });

        it('TEST: Clear referents communication preference', (done) => {
            let body = { 'association': 'user@referent.com' };
            chai.request(app)
                .delete('/referent/clearpreferences')
                .send(body)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('Message');
                    done();
                });
        });

        it('TEST: Referent association creation to preference', (done) => {
            let body = {
                association: {
                    preferenceId: "1",
                    email: 'user@referent.com'
                }
            }
            chai.request(app)
                .post('/referent/preferencereferent')
                .send(body)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('Message');
                    done();
                });
        });

        it('TEST: Get all referents', (done) => {
            chai.request(app)
                .get('/referents')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('referents');
                    done();
                });
        });

        it('TEST: Get referent associations', (done) => {
            chai.request(app)
                .get('/referent/associations/user@referent.com')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('preferenceTypes');
                    res.body.should.have.property('organismeReferents');
                    done();
                });
        });

        it('TEST: Get all report preferences', (done) => {
            chai.request(app)
                .get('/preferencesreferent/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('Preferences');
                    done();
                });
        })

        it('TEST: Empty referent associations table', (done) => {
            chai.request(app)
                .del('/referentassociation/wipe')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('Message');
                    done();
                })

        })

        it('TEST: Empty referent preference association table', (done) => {
            chai.request(app)
                .del('/referentpreference/wipe')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('Message');
                    done();
                })
        })

        
        it('TEST: Delete referent by id', (done) => {
            chai.request(app)
            .del('/referent/delete/1')
            .end((err,res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('Message');
                done();
            })
        })

        it('TEST: Empty referent table', (done) => {
            chai.request(app)
                .del('/referent/wipe')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('Message');
                    done();
                })
        })
    })
}