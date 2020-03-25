const { RichEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = {
  name: "warn",
  aliases: ["w"],
  category: "moderation",
  description: "Warns a user.",
  usage: "warn <id or @user> [reason]",
  run: async (client, message, args) => {
    let prefix = await db.fetch(`prefix_${message.guild.id}`);
    if (!prefix) prefix = process.env.PREFIX;
    let modChannel = await db.fetch(`modChannel_${message.guild.id}`);
    if (!modChannel) modChannel = null

    const errorEmbed = new RichEmbed();
    const punishment = "Warn";
    const toWarn = message.mentions.members.first() || message.guild.members.get(args[0]);
    const reason = args.slice(1).join(" ");

    if (!message.member.hasPermission("VIEW_AUDIT_LOG")) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| You do not have permission to use this command!**`)).then(m => m.delete(5000));
    if (!toWarn) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| You must mention a user to warn!**`)).then(m => m.delete(5000));
    if (!reason) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| You must provide a reason for your warn!**`)).then(m => m.delete(5000));
    if (toWarn.id === message.member.id) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| You cannot warn yourself!**`)).then(m => m.delete(5000));
    if (toWarn.highestRole.position >= message.member.highestRole.position) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| That user is a staff!**`)).then(m => m.delete(5000));
    
    const successEmbed = new RichEmbed()
        .setColor("#38013A")
        .setDescription(`✅ **| Successfully warned ${toWarn}!**`);
    try {
      const logEmbed = new RichEmbed()
        .setColor("#38013A")
        .setAuthor("Warn", toWarn.user.displayAvatarURL)
        .setDescription(`${toWarn} has been warned by ${message.member}.`)
        .addField(`Reason`, reason)
        .addField(`IDs`, `\`\`\`v\nUser = ${toWarn.user.id}\nStaff = ${message.member.id}\n\`\`\``)
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
