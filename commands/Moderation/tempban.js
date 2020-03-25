const { RichEmbed } = require("discord.js");
const fs = require("fs");
const db = require("quick.db");

module.exports = {
  name: "tempban",
  aliases: ["timedban", "timeban"],
  category: "moderation",
  description: "Bans a user temporarily.",
  syntax: "[form of time] = \`second\` \`minute\` \`hour\` \`day\`",
  usage: "tempban <id or @user> [time] [form of time] [reason]",
  run: async (client, message, args) => {
    let prefix = await db.fetch(`prefix_${message.guild.id}`);
    if (!prefix) prefix = process.env.PREFIX;
    let modChannel = await db.fetch(`modChannel_${message.guild.id}`);
    if (!modChannel) modChannel = null;

    const errorEmbed = new RichEmbed();
    const punishment = "Temporary Ban";
    const toTempBan = message.mentions.members.first() || message.guild.members.get(args[0]);
    const time = args[1];
    const formTime = args[2];
    const reason = args.slice(3).join(" ");

    if (!message.member.hasPermission("BAN_MEMBERS")) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| You do not have permission to use this command!**`)).then(m => m.delete(5000));
    if (!toTempBan) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| You must mention a user to ban!**`)).then(m => m.delete(5000));
    if (!reason) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| You must provide a reason to ban!**`)).then(m => m.delete(5000));
    if (toTempBan.id === message.member.id) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| You cannot ban yourself!**`)).then(m => m.delete(5000));
    if (toTempBan.highestRole.position >= message.member.highestRole.position) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| That user is a staff!**`)).then(m => m.delete(5000));

    let banTime = args[1];
    if (formTime === "second") banTime = Date.now() + parseInt(banTime) * 1000;
    else if (formTime === "minute") banTime = Date.now() + parseInt(banTime) * 1000 * 60;
    else if (formTime === "hour") banTime = Date.now() + parseInt(banTime) * 1000 * 60 * 60;
    else if (formTime === "day") banTime = Date.now() + parseInt(banTime) * 1000 * 60 * 60 * 24;
    else return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| You must specify a valid form of time to temporarily ban!**`)).then(m => m.delete(5000));

    toTempBan.ban();

    client.tempBans[toTempBan.id] = {
      guild: message.guild.id,
      time: banTime
    }

    fs.writeFile("./tempbans.json", JSON.stringify(client.tempBans, null, 4), err => {
      const successEmbed = new RichEmbed()
        .setColor("#38013A")
        .setDescription(`✅ **| Successfully banned ${toTempBan}!**`);
      try {
        const logEmbed = new RichEmbed()
          .setColor("#38013A")
          .setAuthor("Ban", toTempBan.user.displayAvatarURL)
          .setDescription(`${toTempBan} has been temporarily banned by ${message.member} for ${time} ${formTime}(s).`)
          .addField(`Reason`, `${reason}`)
          .addField(`IDs`, `\`\`\`v\nUser = ${toTempBan.user.id}\nStaff = ${message.member.id}\n\`\`\``)
          .setFooter(client.user.tag, client.user.displayAvatarURL)
          .setTimestamp();
        const modActionChannel = client.channels.get(modChannel);
        modActionChannel.send(logEmbed);
        return message.channel.send(successEmbed);
      } catch(e) {
        console.log(e);
        const setChannel = client.commands.get("setchannel").usage;
        return message.channel.send(successEmbed.setFooter(`To set up logs for mod action, use ${prefix}${setChannel} staff logs`));
      }
    });
  }
}