const { RichEmbed } = require("discord.js");

module.exports = {
  name: "evaluate",
  aliases: ["eval"],
  category: "developer",
  description: "Evaluates the code you input (Bot Developer ONLY).",
  usage: "eval [code]",
  run: async (client, message, args) => {
    const errorEmbed = new RichEmbed().setColor("#F51B00");
    let code = args.join(" ");
    
    if (message.member.id !== process.env.OWNER) return message.channel.send(errorEmbed.setDescription(`❌ **You do not have permission to use this command!**`)).then(m => m.delete(5000));
    if (!code) return message.channel.send(errorEmbed.setDescription(`❌ **You must specify what you want to evaluate!**`)).then(m => m.delete(5000));
    
    try {
      if (code.toLowerCase().includes("token")) return;
      code = eval(code);

      const successEmbed = new RichEmbed()
        .setColor("#ffb7c5")
        .setAuthor(`Result`, client.user.displayAvatarURL)
        .setDescription(`\`\`\`js\n${code}\n\`\`\``)
      return message.channel.send(successEmbed);
    } catch (e) {
      console.log(e);
      const wrongEmbed = new RichEmbed()
        .setColor("#F51B00")
        .setAuthor(`Result`, client.user.displayAvatarURL)
        .setDescription(`\`\`\`js\n${e}\n\`\`\``);
      return message.channel.send(wrongEmbed);
    }
  }
};
