const { RichEmbed } = require("discord.js");

module.exports = {
  name: "setnickname",
  aliases: ["setname"],
  category: "moderation",
  description: "Changes nickname of a user.",
  usage: "setnickname <id or @user> [input]",
  run: async (client, message, args) => {
    const errorEmbed = new RichEmbed();
    const toSetName = message.mentions.members.first() || message.guild.members.get(args[0]);
    const nickname = args.slice(1).join(" ");

    if (!message.member.hasPermission("MANAGE_NICKNAMES")) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| You do not have permission to use this command!**`)).then(m => m.delete(5000));
    if (!toSetName) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| You must mention a user to change nickname!**`)).then(m => m.delete(5000));
    if (!nickname) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| You must specify a nickname to set!**`)).then(m => m.delete(5000));

    toSetName.setNickname(nickname);

    const successEmbed = new RichEmbed()
      .setColor("#38013A")
      .setDescription(`✅ **| Successfully set nickname for ${toSetName} to \`${nickname}\`!**`);
    return message.channel.send(successEmbed);
  }
}