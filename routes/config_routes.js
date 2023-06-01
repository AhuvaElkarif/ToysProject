const indexR = require("./index");
const usersR = require("./users");
const toysR = require("./toys");

exports.routesInit = (app) => {
    app.use("/index", indexR);
    app.use("/users", usersR);
    app.use("/toys", toysR);
}