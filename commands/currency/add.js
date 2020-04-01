const { RichEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = {
  name: "add",
  category: "currency",
  description: "Adds currency to a user.",
  usage: "add [id or @user] [amount]",
  run: async (client, message, args) => {
    const errorEmbed = new RichEmbed().setColor("#F51B00");
    const member = message.mentions.members.first() || message.guild.members.get(args[0]);
    const amount = parseInt(args[1]);
    
    let emote = await db.fetch(`currencyEmote`);
    if (!emote) emote = null;
    let name = await db.fetch(`currencyName`);
    if (!name) name = null;
    
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(errorEmbed.setDescription(`❌ **| You do not have permission to use this command!**`)).then(m => m.delete(5000));
    if (!member) return message.channel.send(errorEmbed.setDescription(`❌ **| You must mention a user to add ${emote}${name}(s)!**`)).then(m => m.delete(5000));
    if (!amount) return message.channel.send(errorEmbed.setDescription(`❌ **| You must specify an amount to add ${emote}${name}(s)!**`)).then(m => m.delete(5000));
    
    db.add(`balance_${member.user.id}`, amount);
    
    const successEmbed = new RichEmbed()
      .setColor("#ffb7c5")
      .setDescription(`✅ **| Successfully added ${emote}\`${amount}\` ${name}(s) to ${member.user}!**`);
    return message.channel.send(successEmbed);
  }
}