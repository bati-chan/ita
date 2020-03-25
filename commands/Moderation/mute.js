const { RichEmbed } = require("discord.js");
const fs = require("fs");
const db = require("quick.db");

module.exports = {
  name: "mute",
  aliases: ["m"],
  category: "moderation",
  description: "Mutes a specified user with an alloted time.",
  syntax: "[form of time] = \`second\` \`minute\` \`hour\` \`day\`",
  usage: "mute <id or @user> [time] [form of time] [reason]",
  run: async (client, message, args) => {
    let prefix = await db.fetch(`prefix_${message.guild.id}`);
    if (!prefix) prefix = process.env.PREFIX;
    let modChannel = await db.fetch(`modChannel_${message.guild.id}`);
    if (!modChannel) modChannel = null
    let muteRole = await db.fetch(`muteRole_${message.guild.id}`);
    if (!muteRole) muteRole = null;

    const errorEmbed = new RichEmbed();
    const punishment = "Mute";
    const toMute = message.mentions.members.first() || message.guild.members.get(args[0]);
    const time = args[1];
    const formTime = args[2];
    const reason = args.slice(3).join(" ");

    if (!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| You do not have permission to use this command!**`)).then(m => m.delete(5000));
    if (!toMute) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| You must mention a user to mute!**`)).then(m => m.delete(5000));
    if (!time) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| You must provide a time to mute!**`)).then(m => m.delete(5000));
    if (!formTime) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| You must specify a form of time to mute!**`)).then(m => m.delete(5000));
    if (!reason) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| You must provide a reason to mute!**`)).then(m => m.delete(5000));
    if (toMute.id === message.author.id) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| You cannot mute yourself!**`)).then(m => m.delete(5000));
    if (toMute.highestRole.position >= message.member.highestRole.position) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| That user is a staff!**`)).then(m => m.delete(5000));

    let muteTime = args[1];
    if (formTime === "second") muteTime = Date.now() + parseInt(muteTime) * 1000;
    else if (formTime === "minute") muteTime = Date.now() + parseInt(muteTime) * 1000 * 60;
    else if (formTime === "hour") muteTime = Date.now() + parseInt(muteTime) * 1000 * 60 * 60;
    else if (formTime === "day") muteTime = Date.now() + parseInt(muteTime) * 1000 * 60 * 60 * 24;
    else return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| You must specify a valid form of time to mute!**`)).then(m => m.delete(5000));

    try {
      if (toMute.roles.has(muteRole.id)) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| This user is already muted!**`)).then(m => m.delete(5000));
      await toMute.addRole(muteRole);

      client.mutes[toMute.id] = {
        guild: message.guild.id,
        time: muteTime,
        muteRole: muteRole.id
      }

      fs.writeFile("./mutes.json", JSON.stringify(client.mutes, null, 4), err => {
        if (err) throw err;
        const successEmbed = new RichEmbed()
          .setColor("#38013A")
          .setDescription(`✅ **| Successfully muted ${toMute}!**`);
        try {
          const logEmbed = new RichEmbed()
            .setColor("#38013A")
            .setAuthor("Mute", toMute.user.displayAvatarURL)
            .setDescription(`${toMute} has been muted by ${message.member} for ${time} ${formTime}(s).`)
            .addField(`Reason`, reason)
            .addField(`IDs`, `\`\`\`v\nUser = ${toMute.user.id}\nStaff = ${message.member.id}\n\`\`\``)
            .setFooter(client.user.tag, client.user.displayAvatarURL)
            .setTimestamp();
          const logChannel = client.channels.get(modChannel);
          logChannel.send(logEmbed);
          return message.channel.send(successEmbed);
        } catch(e) {
          console.log(e);
          const setChannel = client.commands.get("setchannel").usage;
          return message.channel.send(successEmbed.setFooter(`To set up logs for mod action, use ${prefix}${setChannel} staff logs`));
        }
      });
    } catch(e) {
      console.log(e);
      const setMute = client.commands.get("setmute").usage;
      return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| You must set up a mute role first!**`).setFooter(`To set up a mute role for muting users, use ${prefix}${setMute}`)).then(m => m.delete(5000));
    }
  }
};
