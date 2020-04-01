const { RichEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = {
  name: "disable",
  category: "configuration",
  description: "Disables specific functions of bot.",
  syntax: "<selection> = \`welcome message\` \`welcome top message\` \`welcome author picture\` \`welcome author text\` \`welcome title\` \`welcome description\` \`welcome thumbnail\` \`welcome image\` \`welcome color\` \`welcome footer\` \`welcome timestamp\`",
  usage: "disable [selection]",
  run: async (client, message, args) => {
    const errorEmbed = new RichEmbed().setColor("#F51B00");
    const selection = args.join(" ");
    
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(errorEmbed.setDescription(`❌ **| You do not have permission to use this command!**`)).then(m => m.delete(5000));
    if (!selection) return message.channel.send(errorEmbed.setDescription(`❌ **| You must specify a function to disable!**`)).then(m => m.delete(5000));
    
    if (selection.toLowerCase() === "welcome message") {
      db.delete(`welcomeChannel_${message.guild.id}`);
      db.delete(`welcomeRole_${message.guild.id}`);
      db.delete(`welcomeTop_${message.guild.id}`);
      db.delete(`welcomeAuthorPicture_${message.guild.id}`);
      db.delete(`authorText_${message.guild.id}`);
      db.delete(`welcomeTitle_${message.guild.id}`);
      db.delete(`welcomeDesc_${message.guild.id}`);
      db.delete(`welcomeThumbnail_${message.guild.id}`);
      db.delete(`welcomeImage_${message.guild.id}`);
      db.delete(`welcomeColor_${message.guild.id}`);
      db.delete(`welcomeFooter_${message.guild.id}`);
      db.delete(`welcomeTimestamp_${message.guild.id}`);
    } else if (selection.toLowerCase() === "welcome top message") db.delete(`welcomeTop_${message.guild.id}`);
    else if (selection.toLowerCase() === "welcome author picture") db.delete(`welcomeAuthorPicture_${message.guild.id}`);
    else if (selection.toLowerCase() === "welcome author text") db.delete(`authorText_${message.guild.id}`);
    else if (selection.toLowerCase() === "welcome title") db.delete(`welcomeTitle_${message.guild.id}`);
    else if (selection.toLowerCase() === "welcome description") db.delete(`welcomeDesc_${message.guild.id}`);
    else if (selection.toLowerCase() === "welcome thumbnail") db.delete(`welcomeThumbnail_${message.guild.id}`);
    else if (selection.toLowerCase() === "welcome image") db.delete(`welcomeImage_${message.guild.id}`);
    else if (selection.toLowerCase() === "welcome color") db.delete(`welcomeColor_${message.guild.id}`);
    else if (selection.toLowerCase() === "welcome footer") db.delete(`welcomeFooter_${message.guild.id}`);
    else if (selection.toLowerCase() === "welcome timestamp") db.delete(`welcomeTimestamp_${message.guild.id}`);
    else return message.channel.send(errorEmbed.setDescription(`❌ **| You must specify a valid function to disable!**`)).then(m => m.delete(5000));
    
    const successEmbed = new RichEmbed()
      .setColor("#ffb7c5")
      .setDescription(`✅ **| Successfully disabled \`${selection.toLowerCase()}\` from ${client.user}!**`);
    return message.channel.send(successEmbed);
  }
}