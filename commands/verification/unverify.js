const { RichEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = {
  name: "unverify",
  category: "verification",
  description: "Override unverifies a user from the server.",
  usage: "unverify [id or @user]",
  run: async (client, message, args) => {
    const errorEmbed = new RichEmbed().setColor("#F51B00");
    const member = message.mentions.members.first() || message.guild.members.get(args[0]);

    let verifyRole = await db.fetch(`verifyRole_${message.guild.id}`);
    if (verifyRole) verifyRole = message.guild.roles.get(verifyRole);
    else return message.channel.send(errorEmbed.setDescription(`❌ **| There is no verified role configured yet!**`)).then(m => m.delete(5000));

    if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(errorEmbed.setDescription(`❌ **| You do not have permission to use this command!**`)).then(m => m.delete(5000));
    if (!member) return message.channel.send(errorEmbed.setDescription(`❌ **| You must mention a user to override unverify!**`)).then(m => m.delete(5000));
    if (member.user.id === message.member.id) return message.channel.send(errorEmbed.setDescription(`❌ **| You are not able to override unverify yourself!**`)).then(m => m.delete(5000));
    if (!message.member.roles.has(verifyRole.id)) return message.channel.send(errorEmbed.setDescription(`❌ **| This user is not verified in the server!**`)).then(m => m.delete(5000));

    member.removeRole(verifyRole);

    const successEmbed = new RichEmbed()
      .setColor("#ffb7c5")
      .setDescription(`✅ **| Successfully overrode unverified ${member.user}!**`);
    message.channel.send(successEmbed);
    return console.log(`${member.user.tag} has been overrode unverified by ${message.author.tag}`);
  }
}