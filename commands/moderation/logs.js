const { RichEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = {
  name: "logs",
  aliases: ["checklogs", "check", "warnings", "punishments"],
  category: "moderation",
  description: "Checks logs of a specific user.",
  usage: "logs (id or @user)",
  run: async (client, message, args) => {
    const errorEmbed = new RichEmbed().setColor("#F51B00");
    const member = message.mentions.members.first() || message.guild.members.get(args[0]) || message.member;
    
    if (!message.member.hasPermission("VIEW_AUDIT_LOG")) return message.channel.send(errorEmbed.setDescription(`❌ **| You do not have permission to use this command!**`)).then(m => m.delete(5000));
    
    const logsEmbed = new RichEmbed()
      .setColor("#ffb7c5")
      .setAuthor(member.user.tag, member.user.displayAvatarURL);
    
    let warnCount = 0, muteCount = 0, kickCount = 0, tempBanCount = 0;
    let userLogs = await db.fetch(`punishments_${message.guild.id}_${member.user.id}`);
    if (!userLogs) return message.channel.send(logsEmbed.setDescription(`**${member.user} has no warnings!**`));
    if (userLogs.length === 0) return message.channel.send(logsEmbed.setDescription(`**${member.user} has no warnings!**`));
    
    userLogs.forEach(log => {
      const staff = message.guild.members.get(log.staff);
      logsEmbed.addField(`${log.punishment} | Case #${log.caseNum}`, `\`Staff:\` ${staff}\n${log.reason}`);
      if (log.punishment === "Warn") warnCount++;
      if (log.punishment === "Mute") muteCount++;
      if (log.punishment === "Kick") kickCount++;
      if (log.punishment === "Temporary Ban") tempBanCount++;
    });
    return message.channel.send(logsEmbed.setDescription(`${member.user} has ${userLogs.length} log(s).`).setFooter(`Warns: ${warnCount} | Mutes: ${muteCount} | Kicks: ${kickCount} | Bans: ${tempBanCount}`));
  }
}