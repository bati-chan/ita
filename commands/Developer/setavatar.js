const { RichEmbed } = require("discord.js");

module.exports = {
  name: "setavatar",
  aliases: ["setpfp", "seticon"],
  category: "developer",
  description: "Sets the bot profile picture.",
  usage: "setavatar <attach image>",
  run: async (client, message, args) => {
    const errorEmbed = new RichEmbed();
    const picture = args.join(" ");

    if (message.member.id !== process.env.OWNER) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **You do not have permission to use this command!**`)).then(m => m.delete(5000));
    if (!picture) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **You must attach an image link to set the bot's profile picture!**`)).then(m => m.delete(5000));

    client.user.setAvatar(picture).catch(console.error);

    const successEmbed = new RichEmbed()
      .setColor("#38013A")
      .setDescription(`✅ **Successfully set avatar for ${client.user}!**`);
    return message.channel.send(successEmbed);
  }
}