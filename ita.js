const { Client, Collection } = require("discord.js");
const client = new Client();
const express = require("express");
const app = new express();

["commands", "aliases"].forEach(x => client[x] = new Collection());
["command", "event"].forEach(x => require(`./handlers/${x}`)(client));

client.mutes = require("./mutes.json");
client.tempBans = require("./tempbans.json");

app.get("/", (request, response) => response.sendStatus(200));
app.listen(process.env.PORT);
 
client.login(process.env.TOKEN);