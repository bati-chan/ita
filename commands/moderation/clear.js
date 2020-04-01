const { RichEmbed } = require("discord.js");

module.exports = {
  name: "clear",
  aliases: ["c", "clean"],
  category: "moderation",
  description: "Clears nearby bot commands.",
  usage: "clear (amount)",
  run: async (client, message, args) => {
    const errorEmbed = new RichEmbed().setColor("#F51B00");
    const deleteAmount = parseInt(args.join(" "));
    
    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(errorEmbed.setDescription(`❌ **| You do not have permission to use this command!**`)).then(m => m.delete(5000));
    message.channel.fetchMessages().then(msgs => {
      let botMessages = msgs.filter(m => m.author.bot);
      message.delete();
      return message.channel.bulkDelete(botMessages, true);
    })
  }
}