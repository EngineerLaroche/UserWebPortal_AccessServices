let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

module.exports = function (app) {
    describe('OrganismesReferent request test', () => {
        before(function(done) { //Empty the organismereferent table before beginning the tests
            chai.request(app)
                .del('/organismereferent/wipe')
                .end((err, res) => {
                    done();
                });
        }
        )
        it('TEST: OrganismeReferent creation success', (done) => {
            let body = {
                organismeReferent: {
                    email: "organisme@referent.com",
                    name: "Organisme referent test",
                    phone: "18669999999",
                    fax: "1111111111",
                    website: "www.orgreferent.com",
                    state: "0",
                    organisme: "1",
                    address: {
                        nocivique: "3845",
                        street: "Berne",
                        city: "Brossard",
                        province: "Quebec",
                        postalcode: "J4Z 2P3"
                    }
                }
            }

            chai.request(app)
                .post('/organismereferent/create')
                .send(body)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('Message');
                    done();
                });
        });
        it('TEST: OrganismeReferent update success', (done) => {
            let body = {
                organismeReferent: {
                    email: "organisme@referent.com",
                    name: "Organisme referentff",
                    phone: "186611111",
                    fax: "22222221",
                    website: "www.orgrefwrent.com",
                    state: "0",
                    organisme: "1",
                    address: {
                        nocivique: "3845",
                        street: "Berne",
                        city: "Brossard",
                        province: "Quebec",
                        postalcode: "J4Z 2P3"
                    }
                }
            }

            chai.request(app)
                .put('/organismereferent/update')
                .send(body)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('Message');
                    done();
                });
        });
        it('TEST: OrganismeReferent get by email returns organismereferent', (done) => {
            let body = {
                organismeReferent: {
                    email: "organisme@referent.com"
                }
            }
            chai.request(app)
                .get('/organismereferent/' + body.organismeReferent.email)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('organismeReferent');
                    done();
                });
        });
        it('TEST: OrganismeReferent get by email with invalid email returns error', (done) => {
            let body = {
                organismeReferent: {
                    email: 'noorganisme@referent.com'
                }
            }
            chai.request(app)
                .get('/organismereferent/' + body.organismeReferent.email)
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });
        it('TEST: OrganismeReferent get all', (done) => {
            chai.request(app)
                .get('/organismereferents')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('rows');
                    done();
                });
        });
        it('TEST: OrganismeReferent delete', (done) => {
            chai.request(app)
                .delete('/organismereferent/delete/1')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('Message');
                    done();
                });
        });

        it('TEST: Empty OrganismeReferent table', (done) => {
            chai.request(app)
                .del('/organismereferent/wipe')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('Message');
                    done();
                });
        })
    })
}