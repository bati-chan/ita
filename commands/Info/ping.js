const { RichEmbed } = require("discord.js");

module.exports = {
  name: "ping",
  category: "info",
  description: "Returns latency.",
  usage: "ping",
  run: async (client, message, args) => {
    const pingEmbed = new RichEmbed()
      .setColor("#38013A")
      .setTitle("Ping")
      .addField(`**Ping:**`, `\`${message.createdTimestamp - message.createdTimestamp}\` ms`)
      .addField(`**Latency:**`, `\`${Math.round(client.ping)}\` ms`);
    return message.channel.send(pingEmbed);
  }
};
