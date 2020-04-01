const { RichEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = {
  name: "deletelog",
  category: "moderation",
  description: "Deletes logs of a specific user.",
  usage: "deletelog [id or @user] [all/case number]",
  run: async (client, message, args) => {
    const errorEmbed = new RichEmbed().setColor("#F51B00");
    const member = message.mentions.members.first() || message.guild.members.get(args[0]);
    const choice = args.slice(1).join(" ");
    
    if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send(errorEmbed.setDescription(`❌ **| You do not have permission to use this command!**`)).then(m => m.delete(5000));
    if (!member) return message.channel.send(errorEmbed.setDescription(`❌ **| You must mention a user to clear logs!**`)).then(m => m.delete(5000));
    if (!choice) return message.channel.send(errorEmbed.setDescription(`❌ **| You must specify logs to clear!**`)).then(m => m.delete(5000));
    
    let userLogs = await db.fetch(`punishments_${message.guild.id}_${member.user.id}`);
    if (!userLogs) return message.channel.send(errorEmbed.setDescription(`❌ **| There are no logs to clear from ${member.user}!**`)).then(m => m.delete(5000));
    
    if (choice.toLowerCase() === "all") {
      db.delete(`punishments_${message.guild.id}_${member.user.id}`);
      const successEmbed = new RichEmbed()
        .setColor("#ffb7c5")
        .setDescription(`✅ **| Successfully cleared \`all\` logs for ${member.user}!**`);
      return message.channel.send(successEmbed);
    }
    else if (parseInt(choice)) {
      let found = false;
      userLogs.forEach(log => {
        if (log.caseNum === parseInt(choice)) {
          userLogs = userLogs.filter(c => c.caseNum !== parseInt(choice));
          db.set(`punishments_${message.guild.id}_${member.user.id}`, userLogs);
          found = true;
        }
      });
      if (found) {
        const successEmbed = new RichEmbed()
          .setColor("#ffb7c5")
          .setDescription(`✅ **| Successfully cleared Case #\`${choice}\` for ${member.user}!**`);
        return message.channel.send(successEmbed);
      } else return message.channel.send(errorEmbed.setDescription(`❌ **| There are no cases for ${member.user} matching #\`${choice}\`!**`)).then(m => m.delete(5000));
    } else return message.channel.send(errorEmbed.setDescription(`❌ **| You must specify \`all/case number\` to clear!**`)).then(m => m.delete(5000));
  }
}