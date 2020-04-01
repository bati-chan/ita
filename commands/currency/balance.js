const { RichEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = {
  name: "balance",
  aliases: ["bal"],
  category: "currency",
  description: "Shows your balance with bot currency.",
  usage: "balance (id or @user)",
  run: async (client, message, args) => {
    const member = message.mentions.members.first() || message.guild.members.get(args[0]) || message.member;
    
    let emote = await db.fetch(`currencyEmote`);
    if (!emote) emote = null;
    let name = await db.fetch(`currencyName`);
    if (!name) name = null;
    let bal = await db.fetch(`balance_${member.user.id}`);
    if (!bal) bal = 0;
    
    const balEmbed = new RichEmbed()
      .setColor("#ffb7c5")
      .setDescription(`**${member.user} has a balance of ${emote}\`${bal}\` ${name}(s)!**`)
    return message.channel.send(balEmbed);
  }
}