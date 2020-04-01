const { RichEmbed } = require("discord.js");

module.exports = {
  name: "massdelete",
  aliases: ["purge"],
  category: "moderation",
  description: "Deletes a specified amount of messages.",
  usage: "massdelete [amount]",
  run: async (client, message, args) => {
    const errorEmbed = new RichEmbed().setColor("#F51B00");
    const deleteAmount = parseInt(args.join(" "));

    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(errorEmbed.setDescription(`❌ **| You do not have permission to use this command!**`)).then(m => m.delete(5000));
    if (!deleteAmount) return message.channel.send(errorEmbed.setDescription(`❌ **| You must specify an amount of messages to delete!**`)).then(m => m.delete(5000));
    
    return message.channel.bulkDelete(deleteAmount, true);
  }
}
