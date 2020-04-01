const { RichEmbed } = require("discord.js");
const db = require("quick.db");
const formatDate = require("dateformat");

module.exports = {
  name: "bot",
  aliases: ["version", "client"],
  category: "info",
  description: "Returns bot information.",
  usage: "bot",
  run: async (client, message, args) => {
    let prefix = await db.fetch(`prefix_${message.guild.id}`);
    if (!prefix) prefix = process.env.PREFIX;
    
    const created = formatDate(client.user.createdAt);
    const joined = formatDate(client.user.joinedAt);
    const serverOwner = message.guild.owner;
    
    const botEmbed = new RichEmbed()
      .setColor("#ffb7c5")
      .setTitle(client.user.username)
      .setThumbnail(client.user.displayAvatarURL)
      .setDescription(`Diagnostics of ${client.user.username}`)
      .addField(`Version`, "[`11.5.1`](https://discord.js.org/#/docs/main/11.5.1/general/welcome)", true)
      .addField(`Guild Name`, message.guild.name, true)
      .addField(`Client Tag`, client.user.tag, true)
      .addField(`Library`, `\`discord.js\``, true)
      .addField(`Guild ID`, `\`${message.guild.id}\``, true)
      .addField(`Client ID`, `\`${client.user.id}\``, true)
      .addField(`Node Version`, "[`12.16.1`](https://nodejs.org/en/blog/release/v12.16.1/)", true)
      .addField(`Host`, "[`Glitch`](https://glitch.com/)", true)
      .addField(`Region`, `\`nam5 (us-central)\``, true)
      .addField(`Guild Size`, `\`${client.guilds.size}\``, true)
      .addField(`Joined`, `\`${joined}\``, true)
      .addField(`Created`, `\`${created}\``, true)
      .addField(`Guild Owner`, serverOwner.user.tag, true)
      .addField(`Client Owner`, `bati#0001`, true)
      .setFooter(`Current Prefix: ${prefix}`);
    return message.channel.send(botEmbed);
  }
};
