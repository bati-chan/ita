const { RichEmbed } = require("discord.js");
const formatDate = require("dateformat");

module.exports = {
  name: "userinfo",
  aliases: ["user"],
  category: "info",
  description: "Returns user information.",
  usage: "userinfo (id or @user)",
  run: async (client, message, args) => {
    const member = message.mentions.members.first() || message.guild.members.get(args[0]) || message.member;
    const joined = formatDate(member.joinedAt);
    const roles = member.roles.filter(r => r.id !== message.guild.id).map(r => r).join(" | ") || "none";
    const created = formatDate(member.user.createdAt);

    const embed = new RichEmbed()
      .setAuthor(member.user.tag, member.user.displayAvatarURL)
      .setThumbnail(member.user.displayAvatarURL)
      .setColor(member.displayHexColor === "#000000"? "#ffffff": member.displayHexColor)
      .setDescription(`User information for ${member}`)
      .addField(`Nickname`, `${member.displayName}`, true)
      .addField(`Username`, `${member.user.username}`, true)
      .addField(`Tag`, `${member.user.tag}`, true)
      .addField(`ID`, `\`${member.user.id}\``, true)
      .addField(`Joined`, `${joined}`, true)
      .addField(`Created`, `${created}`, true)
      .addField(`Roles`, `${roles}`, true)
      .setFooter(`Current Status: ${member.user.presence.status}`)
    return message.channel.send(embed);
  }
};
