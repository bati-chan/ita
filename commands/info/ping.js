const { RichEmbed } = require("discord.js");

module.exports = {
  name: "ping",
  category: "info",
  description: "Returns latency.",
  usage: "ping",
  run: async (client, message, args) => {
    const pingEmbed = new RichEmbed()
      .setColor("#ffb7c5")
      .setDescription(`❧ \`${client.ping}\` ms`);
    return message.channel.send(pingEmbed);
  }
};
