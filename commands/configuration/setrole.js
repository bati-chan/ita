const { RichEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = {
  name: "setrole",
  category: "configuration",
  description: "Sets roles of bot.",
  syntax: "[type] = \`mute\` \`welcome\` \`verify\`",
  usage: "setrole [@role] [type]",
  run: async (client, message, args) => {
    const errorEmbed = new RichEmbed().setColor("#F51B00");
    const role = message.mentions.roles.first();
    const type = args.slice(1).join(" ");

    if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(errorEmbed.setDescription(`❌ **| You do not have permission to use this command!**`)).then(m => m.delete(5000));
    if (!role) return message.channel.send(errorEmbed.setDescription(`❌ **| You must mention a role to set up!**`)).then(m => m.delete(5000));
    if (!type) return message.channel.send(errorEmbed.setDescription(`❌ **| You must specify a type of channel to set up!**`)).then(m => m.delete(5000));

    if (type.toLowerCase() === "mute") db.set(`muteRole_${message.guild.id}`, role.id);
    else if (type.toLowerCase() === "welcome") db.set(`welcomeRole_${message.guild.id}`, role.id);
    else if (type.toLowerCase() === "verify") db.set(`verifyRole_${message.guild.id}`, role.id);
    else return message.channel.send(errorEmbed.setDescription(`❌ **| You must specify a valid type of role to set up!**`)).then(m => m.delete(5000));

    const successEmbed = new RichEmbed()
      .setColor("#ffb7c5")
      .setDescription(`✅ **| Successfully set ${type} role to ${role}!**`);
    return message.channel.send(successEmbed);
  }
}