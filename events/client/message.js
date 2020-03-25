const { RichEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = async (client, message) => {
  let prefix = await db.fetch(`prefix_${message.guild.id}`);
  if (!prefix) prefix = process.env.PREFIX;
  
  if (message.content.toLowerCase() === "prefix") {
    const prefixEmbed = new RichEmbed()
      .setColor("#38013A")
      .setDescription(`**Current prefix is \`${prefix}\`!**`);
    message.channel.send(prefixEmbed);
  }
  
  let args = message.content.slice(prefix.length).trim().split(/ +/g);
  let cmd = args.shift().toLowerCase();
  if (!message.content.startsWith(prefix)) return;
  let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
  if (command) command.run(client, message, args);
}