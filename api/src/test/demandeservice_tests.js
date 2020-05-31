let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();
var moment = require('moment');

chai.use(chaiHttp);

module.exports = function (app) {
    describe('DemandeDeService request test', () => {
        before(function (done) { //Empty the demandedeservice table before beginning the tests
            chai.request(app)
                .del('/demandeservice/wipe')
                .end((err, res) => {
                    chai.request(app)
                        .del('/servicemotif/wipe')
                        .end((err, res) => {
                            done();
                        })
                });
        }
        )
        it('TEST: DemandeDeService creation success', (done) => {
            var dateDispo = new Date("December 17, 1995 11:11:00");
            var fromDispo = dateDispo.getHours() + ":" + dateDispo.getMinutes();
            var toDispo = dateDispo.getHours() + ":" + dateDispo.getMinutes();
            let body = {
                demandeservice: {
                    date: "11/11/2018",
                    frequence: "Weekly",
                    serviceType: { value: "1" },
                    motifs: "1,2",
                    noDossierFamille: "A-123",
                    transport: {
                        name: "Bob",
                        phone: "12399999"
                    },
                    parent: {
                        type: "1",
                        firstname: "Marc",
                        lastname: "Auger",
                        phone: "1434543",
                        email: "marc_auger@hotmail.com",
                        birthdate: "02/07/1993",
                        note: "notetest",
                        noLicense: "1942jwfwe",
                        noRAMQ: "222bw11",
                        idcard: "null",
                        contact: "TestContact, 123-321123",
                        avocat: [{
                            label: "Referent Test",
                            value: 1
                        }],
                        address: {
                            nocivique: "3845",
                            street: "Berne",
                            city: "Brossard",
                            province: "Quebec",
                            postalcode: "J4z2p3"
                        }
                    },
                    dispoFirstParent: [{
                        date: dateDispo,
                        from: fromDispo,
                        to: toDispo
                    }],
                    secondParent: {
                        type: "2",
                        firstname: "Marcc",
                        lastname: "Augerr",
                        phone: "143454w3",
                        email: "marc_auwger@hotmail.com",
                        birthdate: "02/07/1991",
                        note: "note2st",
                        noLicense: "12jwfwe",
                        noRAMQ: "211bw11",
                        idcard: "null",
                        contact: "TestContact, 123-321123",
                        avocat: [{
                            label: "Referent Test",
                            value: 1
                        }],
                        address: {
                            nocivique: "1845",
                            street: "3erne",
                            city: "vrossard",
                            province: "Qeuebec",
                            postalcode: "f4z2p3"
                        }
                    },
                    dispoSecondParent: [{
                        date: dateDispo,
                        from: fromDispo,
                        to: toDispo
                    }],
                    enfants: [{
                        firstname: "Marc-Andre",
                        lastname: "Auger",
                        allergies: "aucune",
                        birthdate: "02/07/1993",
                        noRAMQ: "32918283"
                    }
                        , {
                        firstname: "Test",
                        lastname: "Tester",
                        allergies: "peanut",
                        birthdate: "04/01/1998",
                        noRAMQ: "3291113"
                    }
                    ]
                }
            }

            chai.request(app)
                .post('/demandeservice/create')
                .send(body)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('Message');
                    done();
                });
        })

        it('TEST: DemandeDeService creation fail empty demande infos', (done) => {
            let body = {
                demandeservice: {
                    date: "",
                    frequence: "",
                    serviceType: { value: "1" },
                    motifs: "",
                    noDossierFamille: "",
                    transport: {
                        name: "Bob",
                        phone: "12399999"
                    },
                    parent: {
                        type: "1",
                        firstname: "Marc",
                        lastname: "Auger",
                        phone: "1434543",
                        email: "marc_auger@hotmail.com",
                        birthdate: "02/07/1993",
                        note: "notetest",
                        noLicense: "1942jwfwe",
                        noRAMQ: "222bw11",
                        idcard: "null",
                        contact: "TestContact, 123-321123",
                        avocat: [{
                            label: "Referent Test",
                            value: 1
                        }],
                        address: {
                            nocivique: "3845",
                            street: "Berne",
                            city: "Brossard",
                            province: "Quebec",
                            postalcode: "J4z2p3"
                        }
                    },
                    secondParent: {
                        type: "2",
                        firstname: "Marcc",
                        lastname: "Augerr",
                        phone: "143454w3",
                        email: "marc_auwger@hotmail.com",
                        birthdate: "02/07/1991",
                        note: "note2st",
                        noLicense: "12jwfwe",
                        noRAMQ: "211bw11",
                        idcard: "null",
                        contact: "TestContact, 123-321123",
                        avocat: [{
                            label: "Referent Test",
                            value: 1
                        }],
                        address: {
                            nocivique: "1845",
                            street: "3erne",
                            city: "vrossard",
                            province: "Qeuebec",
                            postalcode: "f4z2p3"
                        }
                    },
                    enfants: [{
                        firstname: "Marc-Andre",
                        lastname: "Auger",
                        allergies: "aucune",
                        birthdate: "02/07/1993",
                        noRAMQ: "32918283"
                    }
                        , {
                        firstname: "Test",
                        lastname: "Tester",
                        allergies: "peanut",
                        birthdate: "04/01/1998",
                        noRAMQ: "3291113"
                    }
                    ]
                }
            }

            chai.request(app)
                .post('/demandeservice/create')
                .send(body)
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        })


        it('TEST: DemandeDeService creation fail empty parents', (done) => {
            let body = {
                demandeservice: {
                    date: "11/11/2018",
                    frequence: "Weekly",
                    serviceType: { value: "1" },
                    motifs: "1,2",
                    noDossierFamille: "A-123",
                    transport: {
                        name: "Bob",
                        phone: "12399999"
                    },
                    parent: {
                        type: "",
                        firstname: "",
                        lastname: "",
                        phone: "",
                        email: "",
                        birthdate: "",
                        note: "",
                        noLicense: "",
                        noRAMQ: "",
                        idcard: "",
                        contact: "",
                        avocat: [],
                        address: {
                            nocivique: "",
                            street: "",
                            city: "",
                            province: "",
                            postalcode: ""
                        }
                    },
                    secondParent: {
                        type: "",
                        firstname: "",
                        lastname: "",
                        phone: "",
                        email: "",
                        birthdate: "",
                        note: "",
                        noLicense: "",
                        noRAMQ: "",
                        idcard: "",
                        contact: "",
                        avocat: [],
                        address: {
                            nocivique: "",
                            street: "",
                            city: "",
                            province: "",
                            postalcode: ""
                        }
                    },
                    enfants: [{
                        firstname: "Marc-Andre",
                        lastname: "Auger",
                        allergies: "aucune",
                        birthdate: "02/07/1993",
                        noRAMQ: "32918283"
                    }
                        , {
                        firstname: "Test",
                        lastname: "Tester",
                        allergies: "peanut",
                        birthdate: "04/01/1998",
                        noRAMQ: "3291113"
                    }
                    ]
                }
            }

            chai.request(app)
                .post('/demandeservice/create')
                .send(body)
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        })

        it('TEST: DemandeDeService creation fail no enfants', (done) => {
            let body = {
                demandeservice: {
                    date: "11/11/2018",
                    frequence: "Weekly",
                    serviceType: { value: "1" },
                    motifs: "1,2",
                    noDossierFamille: "A-123",
                    transport: {
                        name: "Bob",
                        phone: "12399999"
                    },
                    parent: {
                        type:"1",
                        firstname: "Marc",
                        lastname: "Auger",
                        phone: "1434543",
                        email: "marc_auger@hotmail.com",
                        birthdate: "02/07/1993",
                        note: "notetest",
                        noLicense: "1942jwfwe",
                        noRAMQ: "222bw11",
                        idcard: "null",
                        contact: "TestContact, 123-321123",
                        avocat: [{
                            label: "Referent Test",
                            value: 1
                        }],
                        address: {
                            nocivique: "3845",
                            street: "Berne",
                            city: "Brossard",
                            province: "Quebec",
                            postalcode: "J4z2p3"
                        }
                    },
                    secondParent: {
                        type: "2",
                        firstname: "Marcc",
                        lastname: "Augerr",
                        phone: "143454w3",
                        email: "marc_auwger@hotmail.com",
                        birthdate: "02/07/1991",
                        note: "note2st",
                        noLicense: "12jwfwe",
                        noRAMQ: "211bw11",
                        idcard: "null",
                        contact: "TestContact, 123-321123",
                        avocat: [{
                            label: "Referent Test",
                            value: 1
                        }],
                        address: {
                            nocivique: "1845",
                            street: "3erne",
                            city: "vrossard",
                            province: "Qeuebec",
                            postalcode: "f4z2p3"
                        }
                    },
                    enfants: []
                }
            }

            chai.request(app)
                .post('/demandeservice/create')
                .send(body)
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        })

        it('TEST: DemandeDeService creation success without second parent infos', (done) => {
            let body = {
                demandeservice: {
                    date: "11/11/2018",
                    frequence: "Weekly",
                    serviceType: { value: "1" },
                    motifs: "1,2",
                    noDossierFamille: "A-123",
                    transport: {
                        name: "Bob",
                        phone: "12399999"
                    },
                    parent: {
                        type: "1",
                        firstname: "Marc",
                        lastname: "Auger",
                        phone: "1434543",
                        email: "marc_auger@hotmail.com",
                        birthdate: "02/07/1993",
                        note: "notetest",
                        noLicense: "1942jwfwe",
                        noRAMQ: "222bw11",
                        idcard: "null",
                        contact: "TestContact, 123-321123",
                        avocat: [{
                            label: "Referent Test",
                            value: 1
                        }],
                        address: {
                            nocivique: "3845",
                            street: "Berne",
                            city: "Brossard",
                            province: "Quebec",
                            postalcode: "J4z2p3"
                        }
                    },
                    secondParent: {
                        type: "",
                        firstname: "",
                        lastname: "",
                        phone: "",
                        email: "",
                        birthdate: "",
                        note: "",
                        noLicense: "",
                        noRAMQ: "",
                        idcard: "",
                        contact: "",
                        avocat: [],
                        address: {
                            nocivique: "",
                            street: "",
                            city: "",
                            province: "",
                            postalcode: ""
                        }
                    },
                    enfants: [{
                        firstname: "Marc",
                        lastname: "Test",
                        allergies: "aucunes",
                        birthdate: "02/07/1991",
                        noRAMQ: "321111183"
                    }
                    ]
                }
            }

            chai.request(app)
                .post('/demandeservice/create')
                .send(body)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('Message');
                    done();
                });
        })
        it('TEST: DemandeDeService update success with new second parent added', (done) => {
            let body = {
                demandeservice: {
                    date: "12/12/2018",
                    frequence: "Daily",
                    serviceType: { value: "1" },
                    motifs: "1,2",
                    noDossierFamille: "A-123",
                    transport: {
                        id: "1",
                        name: "Bob",
                        phone: "12399999"
                    },
                    parent: {
                        id: "1",
                        type: "1",
                        firstname: "Marc",
                        lastname: "Auger",
                        phone: "1434543",
                        email: "marc_auger@hotmail.com",
                        birthdate: "02/07/1993",
                        note: "notetest",
                        noLicense: "1942jwfwe",
                        noRAMQ: "222bw11",
                        idcard: "null",
                        contact: "TestContact, 123-321123",
                        address: {
                            id: "1",
                            nocivique: "3845",
                            street: "Berne",
                            city: "Brossard",
                            province: "Quebec",
                            postalcode: "J4z2p3"
                        }
                    },
                    secondParent: {
                        type: "2",
                        firstname: "Marcc",
                        lastname: "Augerr",
                        phone: "143454w3",
                        email: "marc_auwger@hotmail.com",
                        birthdate: "02/07/1991",
                        note: "note2st",
                        noLicense: "12jwfwe",
                        noRAMQ: "211bw11",
                        idcard: "null",
                        contact: "TestContact, 123-321123",
                        address: {
                            nocivique: "1845",
                            street: "3erne",
                            city: "vrossard",
                            province: "Qeuebec",
                            postalcode: "f4z2p3"
                        }
                    },
                    enfants: [{
                        firstname: "Marc-Andre",
                        lastname: "Auger",
                        allergies: "aucune",
                        birthdate: "02/07/1993",
                        noRAMQ: "32918283"
                    }
                        , {
                        firstname: "Test",
                        lastname: "Tester",
                        allergies: "peanut",
                        birthdate: "04/01/1998",
                        noRAMQ: "3291113"
                    }
                    ]
                }
            }

            chai.request(app)
                .put('/demandeservice/update')
                .send(body)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('Message');
                    done();
                });
        })
        it('TEST: DemandeDeService update fail no enfant', (done) => {
            let body = {
                demandeservice: {
                    date: "12/12/2018",
                    frequence: "Daily",
                    serviceType: { value: "1" },
                    motifs: "1,2",
                    noDossierFamille: "A-123",
                    transport: {
                        id: "1",
                        name: "Bob",
                        phone: "12399999"
                    },
                    parent: {
                        id: "1",
                        type: "1",
                        firstname: "Marc",
                        lastname: "Auger",
                        phone: "1434543",
                        email: "marc_auger@hotmail.com",
                        birthdate: "02/07/1993",
                        note: "notetest",
                        noLicense: "1942jwfwe",
                        noRAMQ: "222bw11",
                        idcard: "null",
                        contact: "TestContact, 123-321123",
                        address: {
                            id: "1",
                            nocivique: "3845",
                            street: "Berne",
                            city: "Brossard",
                            province: "Quebec",
                            postalcode: "J4z2p3"
                        }
                    },
                    secondParent: {
                        type: "2",
                        firstname: "Marcc",
                        lastname: "Augerr",
                        phone: "143454w3",
                        email: "marc_auwger@hotmail.com",
                        birthdate: "02/07/1991",
                        note: "note2st",
                        noLicense: "12jwfwe",
                        noRAMQ: "211bw11",
                        idcard: "null",
                        contact: "TestContact, 123-321123",
                        address: {
                            nocivique: "1845",
                            street: "3erne",
                            city: "vrossard",
                            province: "Qeuebec",
                            postalcode: "f4z2p3"
                        }
                    },
                    enfants: []
                }
            }

            chai.request(app)
                .put('/demandeservice/update')
                .send(body)
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        })
        it('TEST: DemandeDeService update with existing second parent et new enfant', (done) => {
            let body = {
                demandeservice: {
                    date: "12/12/2018",
                    frequence: "Daily",
                    serviceType: { value: "1" },
                    motifs: "1,2",
                    noDossierFamille: "A-123",
                    transport: {
                        id: "1",
                        name: "Bob",
                        phone: "12399999"
                    },
                    parent: {
                        id: "1",
                        type: "1",
                        firstname: "Marc",
                        lastname: "Auger",
                        phone: "1434543",
                        email: "marc_auger@hotmail.com",
                        birthdate: "02/07/1993",
                        note: "notetest",
                        noLicense: "1942jwfwe",
                        noRAMQ: "222bw11",
                        idcard: "null",
                        contact: "TestContact, 123-321123",
                        address: {
                            id: "1",
                            nocivique: "3845",
                            street: "Berne",
                            city: "Brossard",
                            province: "Quebec",
                            postalcode: "J4z2p3"
                        }
                    },
                    secondParent: {
                        id: "2",
                        type: "2",
                        firstname: "Marcc",
                        lastname: "Augerr",
                        phone: "143454w3",
                        email: "marc_auwger@hotmail.com",
                        birthdate: "02/07/1991",
                        note: "note2st",
                        noLicense: "12jwfwe",
                        noRAMQ: "211bw11",
                        idcard: "null",
                        contact: "TestContact, 123-321123",
                        address: {
                            id: "2",
                            nocivique: "1845",
                            street: "3erne",
                            city: "vrossard",
                            province: "Qeuebec",
                            postalcode: "f4z2p3"
                        }
                    },
                    enfants: [{
                        id: "1",
                        firstname: "Marc-Andre",
                        lastname: "Auger",
                        allergies: "aucune",
                        birthdate: "02/07/1993",
                        noRAMQ: "32918283"
                    }
                    ,{
                        id: "2",
                        firstname: "Test",
                        lastname: "Tester",
                        allergies: "peanut",
                        birthdate: "04/01/1998",
                        noRAMQ: "3291113"
                    },
                    {
                        firstname: "LeRst",
                        lastname: "Testeur",
                        allergies: "peanuts",
                        birthdate: "04/01/2010",
                        noRAMQ: "11113"
                    }
                    ]
                }
            }

            chai.request(app)
                .put('/demandeservice/update')
                .send(body)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('Message');
                    done();
                });
        })
        it('TEST: DemandeDeService update with existing second parent and new address', (done) => {
            let body = {
                demandeservice: {
                    date: "12/12/2018",
                    frequence: "Daily",
                    serviceType: { value: "1" },
                    motifs: "1,2",
                    noDossierFamille: "A-123",
                    transport: {
                        id: "1",
                        name: "Bob",
                        phone: "12399999"
                    },
                    parent: {
                        id: "1",
                        type: "1",
                        firstname: "Marc",
                        lastname: "Auger",
                        phone: "1434543",
                        email: "marc_auger@hotmail.com",
                        birthdate: "02/07/1993",
                        note: "notetest",
                        noLicense: "1942jwfwe",
                        noRAMQ: "222bw11",
                        idcard: "null",
                        contact: "TestContact, 123-321123",
                        address: {
                            id: "1",
                            nocivique: "3845",
                            street: "Berne",
                            city: "Brossard",
                            province: "Quebec",
                            postalcode: "J4z2p3"
                        }
                    },
                    secondParent: {
                        id: "2",
                        type: "2",
                        firstname: "Marcc",
                        lastname: "Augerr",
                        phone: "143454w3",
                        email: "marc_auwger@hotmail.com",
                        birthdate: "02/07/1991",
                        note: "note2st",
                        noLicense: "12jwfwe",
                        noRAMQ: "211bw11",
                        idcard: "null",
                        contact: "TestContact, 123-321123",
                        address: {
                            nocivique: "1845",
                            street: "3erne",
                            city: "vrossard",
                            province: "Qeuebec",
                            postalcode: "f4z2p3"
                        }
                    },
                    enfants: [{
                        id: "1",
                        firstname: "Marc-Andre",
                        lastname: "Auger",
                        allergies: "aucune",
                        birthdate: "02/07/1993",
                        noRAMQ: "32918283"
                    }
                    ,{
                        id: "2",
                        firstname: "Test",
                        lastname: "Tester",
                        allergies: "peanut",
                        birthdate: "04/01/1998",
                        noRAMQ: "3291113"
                    },
                    {
                        id: "3",
                        firstname: "LeRst",
                        lastname: "Testeur",
                        allergies: "peanuts",
                        birthdate: "04/01/2010",
                        noRAMQ: "11113"
                    }
                    ]
                }
            }

            chai.request(app)
                .put('/demandeservice/update')
                .send(body)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('Message');
                    done();
                });
        })
        it('TEST: Get motifs', (done) => {
            chai.request(app)
                .get('/motifs/')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('Motifs');
                    done();
                });
        });
        it('TEST: ADD motifs valide', (done) => {
            chai.request(app)
                .post('/motifs/add')
                .send({ newMotif: "MotifTest" })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('Message');
                    done();
                });
        });
        it('TEST: ADD motifs invalide', (done) => {
            chai.request(app)
                .post('/motifs/add')
                .send({ newMotif: "" })
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });
        it('TEST: Get demandes de service', (done) => {
            chai.request(app)
                .get('/demandeservices')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('DemandeServices');
                    done();
                });
        });
        it('TEST: Get demande de service par id', (done) => {
            chai.request(app)
                .get('/demandeservice/1')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('DemandeDeService');
                    done();
                });
        });
        it('TEST: Get all parent types', (done) => {
            chai.request(app)
                .get('/parents/types')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('Types');
                    done();
                });
        });
        it('TEST: Get all parent addresses', (done) => {
            chai.request(app)
                .get('/parents/address')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('Addresses');
                    done();
                });
        });
        it('TEST: Clear demande de service table', (done) => {
            chai.request(app)
                .del('/demandeservice/wipe')
                .end((err, res) => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('Message');
                    done();
                });
        })
        it('TEST: Clear transport table', (done) => {
            chai.request(app)
                .del('/transport/wipe')
                .end((err, res) => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('Message');
                    done();
                });
        })
        it('TEST: Clear parent table', (done) => {
            chai.request(app)
                .del('/parent/wipe')
                .end((err, res) => {
                    res.body.should.be.a('object');
                    res.body.should.have.property('Message');
                    done();
                });
        })

    });
}