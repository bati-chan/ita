const { RichEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = {
  name: "setcurrency",
  category: "developer",
  description: "Sets currency of bot for your server.",
  syntax: "<type> = \`name\` \`symbol\`",
  usage: "setcurrency [type] [name]",
  run: async (client, message, args) => {
    const errorEmbed = new RichEmbed().setColor("#F51B00");
    const type = args[0];
    const currency = args.slice(1).join(" ");

    if (message.member.id !== process.env.OWNER) return message.channel.send(errorEmbed.setDescription(`❌ **You do not have permission to use this command!**`)).then(m => m.delete(5000));
    if (!type) return message.channel.send(errorEmbed.setDescription(`❌ **| You must specify a type for the currency you want!**`)).then(m => m.delete(5000));
    if (!currency) return message.channel.send(errorEmbed.setDescription(`❌ **| You must specify a name for the currency you want!**`)).then(m => m.delete(5000));
    
    if (type.toLowerCase() === "symbol") {
      db.set(`currencyEmote`, currency);
      const successEmbed = new RichEmbed()
        .setColor("#ffb7c5")
        .setDescription(`✅ **| Successfully set currency ${type.toLowerCase()} to ${currency}!**`);
      return message.channel.send(successEmbed);
    } else if (type.toLowerCase() === "name") { 
      db.set(`currencyName`, currency);
      const successEmbed = new RichEmbed()
        .setColor("#ffb7c5")
        .setDescription(`✅ **| Successfully set currency ${type.toLowerCase()} to \`${currency}\`!**`);
      return message.channel.send(successEmbed);
    } else return message.channel.send(errorEmbed.setDescription(`❌ **| You must specify a valid type for the currency you want!**`)).then(m => m.delete(5000));
  }
}