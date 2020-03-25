const { RichEmbed } = require("discord.js");
const formatDate = require("dateformat");

module.exports = {
  name: "bot",
  aliases: ["version", "client"],
  category: "info",
  description: "Returns bot information.",
  usage: "bot",
  run: async (client, message, args) => {
    const created = formatDate(client.user.createdAt);
    const joined = formatDate(client.user.joinedAt);
    const botOwner = message.guild.members.get(process.env.OWNER);
    const serverOwner = message.guild.owner;
    
    const botEmbed = new RichEmbed()
      .setColor("#38013A")
      .setTitle(client.user.username)
      .setThumbnail(client.user.displayAvatarURL)
      .setDescription(`Diagnostics of ${client.user.username}`)
      .addField(`Version`, "[`11.5.1`](https://discord.js.org/#/docs/main/11.5.1/general/welcome)", true)
      .addField(`Server Name`, `${message.guild.name}`, true)
      .addField(`Tag`, client.user.tag, true)
      .addField(`Library`, `\`discord.js\``, true)
      .addField(`Server ID`, `\`${message.guild.id}\``, true)
      .addField(`Bot ID`, `\`${client.user.id}\``, true)
      .addField(`Node Version`, "[`12.16.1`](https://nodejs.org/en/blog/release/v12.16.1/)", true)
      .addField(`Host`, "[`Glitch`](https://glitch.com/)", true)
      .addField(`Region`, `\`nam5 (us-central)\``, true)
      .addField(`Guild Size`, `\`${client.guilds.size}\``, true)
      .addField(`Joined`, `\`${joined}\``, true)
      .addField(`Created`, `\`${created}\``, true)
      .addField(`Server Owner`, `${serverOwner.user.tag}`, true)
      .addField(`Bot Owner`, `${botOwner.user.tag}`, true)
      .setFooter(`Current Status: ${client.user.presence.status}`);
    return message.channel.send(botEmbed);
  }
};
