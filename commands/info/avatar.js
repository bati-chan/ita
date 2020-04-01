const { RichEmbed } = require("discord.js");

module.exports = {
  name: "avatar",
  aliases: ["av"],
  category: "info",
  description: "Sends the avatar of a user.",
  usage: "avatar (id or @user)",
  run: async (client, message, args) => {
    const member = message.mentions.members.first() || message.guild.members.get(args[0]) || message.member;
    const avatar = member.user.displayAvatarURL;
    
    const embed = new RichEmbed()
      .setAuthor(`${member.user.username}'s Avatar`, avatar)
      .setImage(avatar)
      .setColor(member.displayHexColor === "#000000" ? "#ffffff" : member.displayHexColor)
    return message.channel.send(embed);
  }
}
