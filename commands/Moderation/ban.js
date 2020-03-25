const { RichEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = {
  name: "ban",
  aliases: ["b"],
  category: "moderation",
  description: "Bans a user.",
  usage: "ban <id or @user> [reason]",
  run: async (client, message, args) => {
    let prefix = await db.fetch(`prefix_${message.guild.id}`);
    if (!prefix) prefix = process.env.PREFIX;
    let modChannel = await db.fetch(`modChannel_${message.guild.id}`);
    if (!modChannel) modChannel = null;
    
    const errorEmbed = new RichEmbed();
    const toBan = message.mentions.members.first() || message.guild.members.get(args[0]);
    const reason = args.slice(1).join(" ");

    if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| You do not have permission to use this command!**`)).then(m => m.delete(5000));
    if (!toBan) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| You must mention a user to ban!**`)).then(m => m.delete(5000));
    if (!reason) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| You must provide a reason to ban!**`)).then(m => m.delete(5000));
    if (toBan.id === message.author.id) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| You cannot ban yourself!**`)).then(m => m.delete(5000));
    if (toBan.highestRole.position >= message.member.highestRole.position) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| That user is a staff!**`)).then(m => m.delete(5000));

    toBan.ban();
    
    const successEmbed = new RichEmbed()
      .setColor("#38013A")
      .setDescription(`✅ **| Successfully banned ${toBan}!**`);
    
    try {
      const logEmbed = new RichEmbed()
        .setColor("#38013A")
        .setAuthor("Ban", toBan.user.displayAvatarURL)
        .setDescription(`${toBan} has been banned by ${message.member}.`)
        .addField(`Reason`, reason)
        .addField(`IDs`, `\`\`\`v\nUser = ${toBan.user.id}\nStaff = ${message.member.id}\n\`\`\``)
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
