const { RichEmbed } = require("discord.js");

module.exports = {
  name: "purge",
  aliases: ["delete"],
  category: "moderation",
  description: "Deletes a specified amount of messages.",
  usage: "purge <amount>",
  run: async (client, message, args) => {
    const errorEmbed = new RichEmbed();
    const deleteAmount = parseInt(args.join(" "));

    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| You do not have permission to use this command!**`)).then(m => m.delete(5000));
    if (!deleteAmount) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| You must specify an amount of messages to delete!**`)).then(m => m.delete(5000));
    
    return message.channel.bulkDelete(deleteAmount, true);
  }
}
