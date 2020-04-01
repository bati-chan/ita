const { RichEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = async (client, message) => {
  if (message.author.bot) return;
  if (message.content === ".pick") return;
  if (message.content === "~c") return;
  if (message.content === "~verify") return;
  if (message.content.length > 1024) return;

  let logChannel = await db.fetch(`logChannel_${message.guild.id}`);
  if (!logChannel) return;
  
  try {
    logChannel = client.channels.get(logChannel);
    const logEmbed = new RichEmbed()
      .setColor("#ffb7c5")
      .setAuthor("Deleted Message", message.member.displayAvatarURL)
      .setDescription(`A deleted message has been found by ${message.member} in ${message.channel}.`)
      .addField(`Message`, message.content)
      .addField(`IDs`, `\`\`\`v\nUser = ${message.member.id}\nMessage = ${message.id}\n\`\`\``)
      .setFooter(client.user.tag, client.user.displayAvatarURL)
      .setTimestamp();
    return logChannel.send(logEmbed);
  } catch(e) {
    console.log(e)
  }
}