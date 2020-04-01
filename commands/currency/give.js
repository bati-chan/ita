const { RichEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = {
  name: "give",
  aliases: ["share"],
  category: "currency",
  description: "Gives currency to a user.",
  usage: "give [id or @user] [amount]",
  run: async (client, message, args) => {
    const errorEmbed = new RichEmbed();
    const member = message.mentions.members.first() || message.guild.members.get(args[0]);
    const amount = parseInt(args[1]);
    
    let emote = await db.fetch(`currencyEmote`);
    if (!emote) emote = null;
    let name = await db.fetch(`currencyName`);
    if (!name) name = null;
    
    if (!member) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| You must mention a user to give ${emote}${name}(s)!**`)).then(m => m.delete(5000));
    if (!amount) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| You must specify an amount to give ${emote}${name}(s)!**`)).then(m => m.delete(5000));
    
    let yourBal = await db.fetch(`balance_${message.member.id}`);
    if (!yourBal) yourBal = 0;
    let memberBal = await db.fetch(`balance_${member.user.id}`);
    if (!memberBal) memberBal = 0;
    if (amount > yourBal) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| You must specify a smaller amount to give ${emote}${name}(s)!**`)).then(m => m.delete(5000));
    db.subtract(`balance_${message.member.id}`, amount);
    db.add(`balance_${member.user.id}`, amount);
    
    const successEmbed = new RichEmbed()
      .setColor("#ffb7c5")
      .setDescription(`✅ **| Successfully gave ${emote}\`${amount}\` ${name}(s) to ${member.user}!**`);
    return message.channel.send(successEmbed);
  }
}