const { RichEmbed } = require("discord.js");

module.exports = {
  name: "say",
  aliases: ["s"],
  category: "fun",
  description: "Returns user input.",
  usage: "say [input]",
  run: (client, message, args) => {
    const errorEmbed = new RichEmbed().setColor("#F51B00");
    let sayContent = args.join(" ");

    if (message.member.id !== process.env.OWNER) return message.channel.send(errorEmbed.setDescription(`❌ **You do not have permission to use this command!**`)).then(m => m.delete(5000));
    if (!sayContent) return message.channel.send(errorEmbed.setDescription(`❌ **You must specify what you want the bot to say!**`)).then(m => m.delete(5000));
    
    message.delete();
    return message.channel.send(sayContent);
  }
};
