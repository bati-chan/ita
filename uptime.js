const express = require("express");
const app = express();
const http = require("http");

app.get("/", (request, response) => response.sendStatus(200));
app.listen(process.env.PORT);

setInterval(() => http.get(`http://${process.env.PROJECT_DOMAIN}.glitch.me/`), 280000);