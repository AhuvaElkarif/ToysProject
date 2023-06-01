const express = require("express");
const http = require("http");
const path = require("path");
const cors = require("cors");
const {routesInit} = require("./routes/config_routes");
require("./db/mongoConnect");

const app = express();
app.use(express.json());
app.use(cors());
app.use(express.static(path.join(__dirname, "public")));

routesInit(app);

const server = http.createServer(app);
console.log(process.env.TEST, process.env.USER_DB)
const port = process.env.PORT  || 3001;
server.listen(port);




