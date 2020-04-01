const { RichEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = {
  name: "setchannel",
  category: "configuration",
  description: "Sets channels of bot.",
  syntax: "[type] = \`logs\` \`staff logs\` \`welcome\` \`verify\`",
  usage: "setchannel [#channel] [type]",
  run: async (client, message, args) => {
    const errorEmbed = new RichEmbed().setColor("#F51B00");
    const channel = message.mentions.channels.first();
    const type = args.slice(1).join(" ");
    
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(errorEmbed.setDescription(`❌ **| You do not have permission to use this command!**`)).then(m => m.delete(5000));
    if (!channel) return message.channel.send(errorEmbed.setDescription(`❌ **| You must mention a channel to set up!**`)).then(m => m.delete(5000));
    if (!type) return message.channel.send(errorEmbed.setDescription(`❌ **| You must specify a type of channel to set up!**`)).then(m => m.delete(5000));
    
    if (type.toLowerCase() === "logs") db.set(`logChannel_${message.guild.id}`, channel.id);
    else if (type.toLowerCase() === "staff logs") db.set(`modChannel_${message.guild.id}`, channel.id);
    else if (type.toLowerCase() === "welcome") db.set(`welcomeChannel_${message.guild.id}`, channel.id);
    else if (type.toLowerCase() === "verify") db.set(`verifyChannel_${message.guild.id}`, channel.id);
    else return message.channel.send(errorEmbed.setDescription(`❌ **| You must specify a valid type of channel to set up!**`)).then(m => m.delete(5000));
    
    const successEmbed = new RichEmbed()
      .setColor("#ffb7c5")
      .setDescription(`✅ **| Successfully set \`${type}\` channel to ${channel}!**`);
    return message.channel.send(successEmbed);
  }
}