const { RichEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = {
  name: "setprefix",
  category: "configuration",
  description: "Sets prefix of bot.",
  usage: "setprefix <input>",
  run: async (client, message, args) => {
    const errorEmbed = new RichEmbed();
    const newPrefix = args.join(" ");

    if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| You do not have permission to use this command!**`)).then(m => m.delete(5000));
    if (!newPrefix) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| You must specify what prefix you want!**`)).then(m => m.delete(5000));
    
    db.set(`prefix_${message.guild.id}`, newPrefix).then(p => {
      const successEmbed = new RichEmbed()
        .setColor("#38013A")
        .setDescription(`✅ **| Successfully set prefix to \`${p}\`!**`);
      return message.channel.send(successEmbed);
    });
  }
}
