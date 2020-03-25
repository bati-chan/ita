const { RichEmbed } = require("discord.js");

module.exports = {
  name: "evaluate",
  aliases: ["eval"],
  category: "developer",
  description: "Evaluates the code you input (Bot Developer ONLY).",
  usage: "eval <code>",
  run: async (client, message, args) => {
    const errorEmbed = new RichEmbed();
    const code = args.join(" ");
    
    if (message.member.id !== process.env.OWNER) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **You do not have permission to use this command!**`)).then(m => m.delete(5000));
    if (!code) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **You must specify what you want to evaluate!**`)).then(m => m.delete(5000));
    
    try {
      if (code.toLowerCase().includes("token")) return;
      const evaluated = eval(code);

      let successEmbed = new RichEmbed()
        .setColor("#38013A")
        .setTitle("Evaluate")
        .setDescription(`Results for your code`)
        .addField("Input",`\`${code}\``)
        .addField("Output", evaluated)
        .addField("Type", typeof evaluated)
        .setFooter(message.member.tag, message.member.displayAvatarURL)
      return message.channel.send(successEmbed);
    } catch (e) {
      console.log(e);
      let wrongEmbed = new RichEmbed()
        .setColor("#F51B00")
        .setDescription(`**❌ ${e}**`)
      return message.channel.send(wrongEmbed);
    }
  }
};
