const { RichEmbed } = require("discord.js");
const fs = require("fs");
const db = require("quick.db");

module.exports = {
  name: "unmute",
  aliases: ["um"],
  category: "moderation",
  description: "Unmutes a muted user.",
  usage: "unmute [id or @user]",
  run: async (client, message, args) => {
    let prefix = await db.fetch(`prefix_${message.guild.id}`);
    if (!prefix) prefix = process.env.PREFIX;
    let modChannel = await db.fetch(`modChannel_${message.guild.id}`);
    if (!modChannel) modChannel = null;
    let muteRole = await db.fetch(`muteRole_${message.guild.id}`);
    if (!muteRole) muteRole = null;

    const errorEmbed = new RichEmbed().setColor("#F51B00");
    const toUnmute = message.mentions.members.first() || message.guild.members.get(args[0]);

    if (!message.guild.me.hasPermission("MANAGE_MESSAGES")) return message.channel.send(errorEmbed.setDescription(`❌ **| You do not have permission to use this command!**`)).then(m => m.delete(5000));
    if (!toUnmute) return message.channel.send(errorEmbed.setDescription(`❌ **| You must mention a user to unmute!**`)).then(m => m.delete(5000));
    if (toUnmute.user.id === message.member.id) return message.channel.send(errorEmbed.setDescription(`❌ **| You are not able to unmute yourself!**`)).then(m => m.delete(5000));
    
    try {
      if (!toUnmute.roles.has(muteRole.id)) return message.channel.send(errorEmbed.setDescription(`❌ **| This user is not muted!**`)).then(m => m.delete(5000));
      await toUnmute.removeRole(muteRole);
      delete client.mutes[toUnmute.id];
      fs.writeFile("./mutes.json", JSON.stringify(client.mutes), err => {
        if (err) throw err;
        const successEmbed = new RichEmbed()
          .setColor("#ffb7c5")
          .setDescription(`✅ **| Successfully unmuted ${toUnmute}!**`);
        try {
          const logEmbed = new RichEmbed()
            .setColor("#ffb7c5")
            .setAuthor("Unmute", toUnmute.user.displayAvatarURL)
            .setDescription(`${toUnmute} has been unmuted by ${message.member}.`)
            .addField(`IDs`, `\`\`\`v\nUser = ${toUnmute.user.id}\nStaff = ${message.member.id}\n\`\`\``)
            .setFooter(client.user.tag, client.user.displayAvatarURL)
            .setTimestamp()
          const modActionChannel = client.channels.get(modChannel);
          modActionChannel.send(logEmbed);
          return message.channel.send(successEmbed);
        } catch(e) {
          console.log(e);
          const setChannel = client.commands.get("setchannel").usage;
          return message.channel.send(successEmbed.setFooter(`To set up logs for staff, use ${prefix}${setChannel} staff logs`));
        }
      });
    } catch(e) {
      console.log(e);
      const setMute = client.commands.get("setmute").usage;
      return message.channel.send(errorEmbed.setDescription(`❌ **| You must set up a mute role first and have someone muted!**`).setFooter(`To set up a mute role for muting users, use ${prefix}${setMute}`)).then(m => m.delete(5000));
    }
  }
};
