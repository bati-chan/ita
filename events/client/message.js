const { RichEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = async (client, message) => {
  const errorEmbed = new RichEmbed();
  if (message.author.bot) return;
  if (message.channel.type === "dm") return;
  
  let prefix = await db.fetch(`prefix_${message.guild.id}`);
  if (!prefix) prefix = process.env.PREFIX;
  let blacklisted = await db.fetch(`blacklistMembers_${message.guild.id}`);
  if (!blacklisted) blacklisted = null;
  let badWords = await db.fetch(`blacklistWords_${message.guild.id}`);
  if (!badWords) badWords = null;
  
  try {
    if (badWords.some(word => message.content.toLowerCase().includes(word))) message.delete();
  } catch(e) {
  
  }
  
  try {
    if (blacklisted.includes(message.member.id)) return;
  } catch(e) {
  
  }
  
  if (message.content.toLowerCase() === "prefix") {
    const prefixEmbed = new RichEmbed()
      .setColor("#ffb7c5")
      .setDescription(`**Current prefix is \`${prefix}\`!**`);
    message.channel.send(prefixEmbed);
  }
  
  let args = message.content.slice(prefix.length).trim().split(/ +/g);
  let cmd = args.shift().toLowerCase();
  if (!message.content.startsWith(prefix)) return;
  let command = client.commands.get(cmd) || client.commands.get(client.aliases.get(cmd));
  if (command) command.run(client, message, args);
}