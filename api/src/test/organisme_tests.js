let chai = require("chai");
let chaiHttp = require("chai-http");
let should = chai.should();

chai.use(chaiHttp);

module.exports = function(app) {
  describe("Organismes request test", () => {
    before(function(done) {
      //Empty the organisme table before beginning the tests
      chai
        .request(app)
        .del("/organisme/wipe")
        .end((err, res) => {
          done();
        });
    });
    it("TEST: Organisme creation success", (done) => {
      let organisme = {
        organisme: {
          email: "organisme@test.com",
          name: "OrganismeTest",
          phone: "18009999999",
          fax: "11111111",
          nocivique: "3845",
          street: "Berne",
          city: "Brossard",
          province: "Quebec",
          postalcode: "J4Z 2P3",
        },
      };
      chai
        .request(app)
        .post("/organisme/create")
        .send(organisme)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("Message");
          done();
        });
    });
    it("TEST: Organisme update success", (done) => {
      let organisme = {
        organisme: {
          id: "1",
          email: "modif@test.com",
          name: "Test",
          phone: "12222229",
          fax: "11333111",
          nocivique: "1845",
          street: "Berne",
          city: "Brossard",
          province: "Quebec",
          postalcode: "J4Z 2P3",
        },
      };
      chai
        .request(app)
        .put("/organisme/update")
        .send(organisme)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("Message");
          done();
        });
    });
    it("TEST: Organisme get by email returns organisme", (done) => {
      let body = {
        organisme: {
          email: "modif@test.com",
        },
      };
      chai
        .request(app)
        .get("/organisme/" + body.organisme.email)
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("organisme");
          done();
        });
    });
    it("TEST: Organisme get by email with invalid email returns error", (done) => {
      let body = {
        organisme: {
          email: "noorganisme@test.com",
        },
      };
      chai
        .request(app)
        .get("/organisme/" + body.organisme.email)
        .end((err, res) => {
          res.should.have.status(500);
          res.body.should.be.a("object");
          res.body.should.have.property("error");
          done();
        });
    });
    it("TEST: Organisme get all organismes", (done) => {
      let body = {
        organisme: {
          email: "noorganisme@test.com",
        },
      };
      chai
        .request(app)
        .get("/organismes")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("rows");
          done();
        });
    });

    it("TEST: Organisme delete", (done) => {
      chai
        .request(app)
        .delete("/organisme/delete/1")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("Message");
          done();
        });
    });

    it("TEST: Empty organisme table", (done) => {
      chai
        .request(app)
        .del("/organisme/wipe")
        .end((err, res) => {
          res.should.have.status(200);
          res.body.should.be.a("object");
          res.body.should.have.property("Message");
          done();
        });
    });
  });
};
