const { RichEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = {
  name: "kick",
  aliases: ["k"],
  category: "moderation",
  description: "Kicks a user.",
  usage: "kick [id or @user] [reason]",
  run: async (client, message, args) => {
    let prefix = await db.fetch(`prefix_${message.guild.id}`);
    if (!prefix) prefix = process.env.PREFIX;
    let modChannel = await db.fetch(`modChannel_${message.guild.id}`);
    if (!modChannel) modChannel = null;
    
    const errorEmbed = new RichEmbed().setColor("#F51B00");
    const punishment = "Kick";
    const toKick = message.mentions.members.first() || message.guild.members.get(args[0]);
    const reason = args.slice(1).join(" ");
    
    if (!message.member.hasPermission("KICK_MEMBERS")) return message.channel.send(errorEmbed.setDescription(`❌ **| You do not have permission to use this command!**`)).then(m => m.delete(5000));
    if (!toKick) return message.channel.send(errorEmbed.setDescription(`❌ **| You must mention a user to kick!**`)).then(m => m.delete(5000));
    if (!reason) return message.channel.send(errorEmbed.setDescription(`❌ **| You must provide a reason to kick!**`)).then(m => m.delete(5000));
    if (toKick.user.id === message.member.id) return message.channel.send(errorEmbed.setDescription(`❌ **| You are not able to kick yourself!**`)).then(m => m.delete(5000));
    if (toKick.highestRole.position >= message.member.highestRole.position) return message.channel.send(errorEmbed.setDescription(`❌ **| You are not able to kick that user!**`)).then(m => m.delete(5000));

    toKick.kick();
    
    let userLogs = await db.fetch(`punishments_${message.guild.id}_${toKick.user.id}`);
    if (!userLogs) userLogs = null;
    let cases = await db.fetch(`caseNum_${message.guild.id}`);
    if (!cases) cases = 0;
    cases = await db.add(`caseNum_${message.guild.id}`, 1);
    db.push(`punishments_${message.guild.id}_${toKick.user.id}`, { punishment: "Kick", caseNum: cases, staff: message.member.id, reason: reason });

    const successEmbed = new RichEmbed()
      .setColor("#ffb7c5")
      .setDescription(`✅ **| Successfully kicked ${toKick}!**`);
    
    try {
      const logEmbed = new RichEmbed()
        .setColor("#ffb7c5")
        .setAuthor("Kick", toKick.user.displayAvatarURL)
        .setDescription(`${toKick} has been kicked by ${message.member}.`)
        .addField(`Reason`, reason)
        .addField(`IDs`, `\`\`\`v\nUser = ${toKick.user.id}\nStaff = ${message.member.id}\n\`\`\``)
        .setFooter(client.user.tag, client.user.displayAvatarURL)
        .setTimestamp();
      const logChannel = client.channels.get(modChannel);
      logChannel.send(logEmbed);
      return message.channel.send(successEmbed);
    } catch(e) {
      console.log(e);
      const setChannel = client.commands.get("setchannel").usage
      return message.channel.send(successEmbed.setFooter(`To set up logs for staff, use ${prefix}${setChannel} staff logs`));
    }
  }
}
