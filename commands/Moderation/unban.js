const { RichEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = {
  name: "unban",
  category: "moderation",
  description: "Unbans a user.",
  usage: "unban <id>",
  run: async (client, message, args) => {
    let prefix = await db.fetch(`prefix_${message.guild.id}`);
    if (!prefix) prefix = process.env.PREFIX;
    let modChannel = await db.fetch(`modChannel_${message.guild.id}`);
    if (!modChannel) modChannel = null

    const errorEmbed = new RichEmbed();
    const toUnban = await client.fetchUser(args[0]);
    const memberCheck = message.guild.members.get(args[0]);

    if (!message.guild.me.hasPermission("BAN_MEMBERS")) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| You do not have permission to use this command!**`)).then(m => m.delete(5000));
    if (!toUnban) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| You must mention a valid id to ban!**`)).then(m => m.delete(5000));
    if (toUnban.id === message.member.id) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| You cannot unban yourself because you aren't banned!**`)).then(m => m.delete(5000));
    if (memberCheck) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| That user is not banned!**`)).then(m => m.delete(5000));

    toUnban.unban();

    const successEmbed = new RichEmbed()
      .setColor("#38013A")
      .setDescription(`✅ **| Successfully unbanned ${toUnban}!**`);
    try {
      const logEmbed = new RichEmbed()
        .setColor("#38013A")
        .setAuthor(`Unban`)
        .setDescription(`${toUnban.tag} has been unbanned by ${message.author}.`)
        .addField(`IDs`, `\`\`\`v\nUser = ${toUnban.user.id}\nStaff = ${message.member.id}\n\`\`\``)
        .setFooter(client.user.tag, client.user.displayAvatarURL)
        .setTimestamp();
      const modActionChannel = client.channels.get(modChannel);
      modActionChannel.send(logEmbed);
      return message.channel.send(successEmbed);
    } catch(e) {
      console.log(e);
      const setChannel = client.commands.get("setchannel").usage;
      return message.channel.send(successEmbed.setFooter(`To set up logs for staff, use ${prefix}${setChannel} staff logs`));
    }
  }
};
