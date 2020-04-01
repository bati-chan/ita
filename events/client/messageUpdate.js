const { RichEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = async (client, oldMessage, newMessage) => {
  if (oldMessage.author.bot) return;
  if (oldMessage.content === newMessage.content) return;
  if (oldMessage.channel.id === "689540035371991101") return;
  if (oldMessage.content.length > 1024) return;
  
  let logChannel = await db.fetch(`logChannel_${oldMessage.guild.id}`);
  if (!logChannel) return;
  
  try {
    logChannel = client.channels.get(logChannel);
    const logEmbed = new RichEmbed()
      .setColor("#ffb7c5")
      .setAuthor("Edited Message", oldMessage.member.displayAvatarURL)
      .setDescription(`An edited message has been found by ${oldMessage.member} in ${oldMessage.channel}.`)
      .addField(`Before`, oldMessage.content)
      .addField(`After`, newMessage.content)
      .addField(`IDs`, `\`\`\`v\nUser = ${oldMessage.member.id}\nMessage = ${oldMessage.id}\n\`\`\``)
      .setFooter(client.user.tag, client.user.displayAvatarURL)
      .setTimestamp();
    return logChannel.send(logEmbed);
  } catch(e) {
    console.log(e)
  }
}