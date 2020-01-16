const app = require("../server");

require("./user_tests")(app, {});
require("./organisme_tests")(app, {});
require("./organismereferent_tests")(app, {});
require("./referent_tests")(app, {});
require("./demandeservice_tests")(app, {});
require("./service_tests")(app, {});
require("./ptservice_tests")(app, {});