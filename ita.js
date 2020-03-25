const { Client, Collection } = require("discord.js");
const client = new Client();
const fs = require("fs");

["commands", "aliases"].forEach(x => client[x] = new Collection());
["command", "event"].forEach(x => require(`./handlers/${x}`)(client));

client.mutes = require("./mutes.json");
client.tempBans = require("./tempbans.json");

client.login(process.env.TOKEN);