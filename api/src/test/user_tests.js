let chai = require('chai');
let chaiHttp = require('chai-http');
let should = chai.should();

chai.use(chaiHttp);

module.exports = function (app) {
    var token;
    describe('Users request test', () => {
        before(function (done) { //Empty the user table before beginning the tests
            chai.request(app)
                .del('/user/wipe')
                .end((err, res) => {
                    done();
                });
        }
        )
        it('TEST: User creation success', (done) => {
            let user = {
                user: {
                    firstname: "Test",
                    lastname: "Tester",
                    email: 'user@test.com',
                    password: 'password',
                    role: '1'
                }
            }
            chai.request(app)
                .post('/user/create')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('Message');
                    done();
                });
        });
        it('TEST: User creation already exist', (done) => {
            let user = {
                user: {
                    firstname: "Test",
                    lastname: "Tester",
                    email: 'user@test.com',
                    password: 'password',
                    role: '1'
                }
            }
            chai.request(app)
                .post('/user/create')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });
        it('TEST: User get by email returns user', (done) => {
            let user = {
                user: {
                    email: 'user@test.com'
                }
            }
            chai.request(app)
                .get('/user/' + user.user.email)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('user');
                    done();
                });
        });
        it('TEST: User get by email with invalid email returns error', (done) => {
            let user = {
                user: {
                    email: 'nousers@nousers.com'
                }
            }
            chai.request(app)
                .get('/user/' + user.user.email)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                    done();
                });
        });
        it('TEST: User update successful', (done) => {
            let user = {
                id: 1,
                firstname: "Test",
                lastname: "Tester",
                email: 'usertest@test.com',
                password: 'password',
                role: '1'
            }
            //Try to find user with email: usertest@test.com \\ Expect an error because no user has this email
            chai.request(app)
                .get('/user/' + user.email)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('error');
                });
            //Update user email for user with id 1 to usertest@test.com
            chai.request(app)
                .put('/user/update')
                .send({ user: user })
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('Message');
                    //Try to find user with email :usertest@test.com \\ Expect the user to be found
                    chai.request(app)
                        .get('/user/' + user.email)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('Message');
                            done();
                        });
                });
        });
        it('TEST: User login with wrong credentials 3 times locks account', (done) => {
            let userWrongCredentials = {
                user: {
                    email: 'usertest@test.com',
                    password: 'wrongpassword'
                }
            }
            //Login attempt with bad credentials, expect error
            chai.request(app)
                .post('/user/login')
                .send(userWrongCredentials)
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.have.property('error');
                    //Login attempt with bad credentials, expect error
                    chai.request(app)
                        .post('/user/login')
                        .send(userWrongCredentials)
                        .end((err, res) => {
                            res.should.have.status(500);
                            res.body.should.have.property('error');
                            //Login attempt with bad credentials, expect error
                            chai.request(app)
                                .post('/user/login')
                                .send(userWrongCredentials)
                                .end((err, res) => {
                                    res.should.have.status(500);
                                    res.body.should.have.property('error');
                                    done();
                                });
                        });
                });
        });

        it('TEST: User login with good credentials with account locked', (done) => {
            let userGoodCredentials = {
                user: {
                    email: 'usertest@test.com',
                    password: 'password'
                }
            }
            //Login attempt with good credentials, expect error because account is locked
            chai.request(app)
                .post('/user/login')
                .send(userGoodCredentials)
                .end((err, res) => {
                    res.should.have.status(500);
                    res.body.should.have.property('error');
                    done();
                });

        });

        it('TEST: Unlock user', (done) => {
            let userGoodCredentials = {
                user: {
                    email: 'usertest@test.com'
                }
            }
            //Unlock account
            chai.request(app)
                .get('/user/unlock/' + userGoodCredentials.user.email)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.have.property('Message');
                    done();
                });
        });

        it('TEST: User login with good credentials returns valid token used to get current user', (done) => {
            let user = {
                user: {
                    email: 'usertest@test.com',
                    password: 'password'
                }
            }
            //Login attempt with good credentials, expect Message
            chai.request(app)
                .post('/user/login')
                .send(user)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('user');
                    chai.request(app)
                        .get('/user')
                        .set('authorization', 'token:' + res.body.user.token)
                        .end((err, resp) => {
                            var id = resp.body.user;
                            resp.should.have.status(200);
                            resp.body.should.be.a('object');
                            resp.body.should.have.property('user');
                            id.should.be.have.property('id', 1);
                            done();
                        });
                });
        });
        it('TEST: User deactivation success', (done) => {
            let body = {
                email: 'usertest@test.com'
            }
            chai.request(app)
                .put('/user/deactivate')
                .send(body)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('Message');
                    done();
                });
        });
        it('TEST: User reactivation success', (done) => {
            let body = {
                email: 'usertest@test.com'
            }
            chai.request(app)
                .put('/user/reactivate')
                .send(body)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('Message');
                    done();
                });
        });


        it('TEST: User delete success', (done) => {
            let user = {
                id: 1,
                email: 'usertest@test.com'

            }
            chai.request(app)
                .del('/user/delete/' + user.id)
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('Message');
                    chai.request(app)
                        .get('/user/' + user.email)
                        .end((err, res) => {
                            res.should.have.status(200);
                            res.body.should.be.a('object');
                            res.body.should.have.property('error');
                            done();
                        });
                });
        });

        it('TEST: Empty user table', (done) => {
            chai.request(app)
                .del('/user/wipe')
                .end((err, res) => {
                    res.should.have.status(200);
                    res.body.should.be.a('object');
                    res.body.should.have.property('Message');
                    done();
                });
        })
    });


}