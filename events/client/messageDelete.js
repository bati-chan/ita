const { RichEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = async (client, message) => {
  if (message.member.bot) return;
  if (message.member.id === "493716749342998541") return;
  if (message.channel.id === "689540035371991101") return;
  if (message.content.length > 1024) return;
  if (message.content === ".pick") return;

  let logChannel = await db.fetch(`logChannel_${message.guild.id}`);
  if (!logChannel) return;
  
  try {
    logChannel = client.channels.get(logChannel);
    const logEmbed = new RichEmbed()
      .setColor("#38013A")
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