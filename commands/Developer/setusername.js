const { RichEmbed } = require("discord.js");

module.exports = {
  name: "setusername",
  category: "developer",
  description: "Sets bot's username.",
  usage: "setusername <input>",
  run: async (client, message, args) => {
    const errorEmbed = new RichEmbed();
    const username = args.join(" ");

    if (message.member.id !== process.env.OWNER) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **You do not have permission to use this command!**`)).then(m => m.delete(5000));
    if (!username) return message.channel.send(errorEmbed.setColor("F51B00").setDescription(`❌ **You must specify a username to set for the bot!`)).then(m => m.delete(5000));

    client.user.setUsername(username).catch(console.error);

    const successEmbed = new RichEmbed()
      .setColor("#38013A")
      .setDescription(`✅ **Successfully set username for ${client.user} to \`${username}\`!**`);
    return message.channel.send(successEmbed);
  }
}