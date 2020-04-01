const { RichEmbed } = require("discord.js");
const { spawn } = require("child_process");

module.exports = {
  name: "restart",
  category: "developer",
  description: "Restarts the bot (Bot Developer ONLY).",
  usage: "restart",
  run: (client, message, args) => {
    const errorEmbed = new RichEmbed().setColor("#F51B00");

    if (message.member.id !== process.env.OWNER) return message.channel.send(errorEmbed.setDescription(`❌ **You do not have permission to use this command!**`)).then(m => m.delete(5000));
    
    setTimeout(function() {
      spawn(process.argv[1], process.argv.slice(2), {
        detached: true,
        stdio: ["inherit"]
      }).unref();
      process.exit();
    }, 2000);

    const restartEmbed = new RichEmbed()
      .setColor("#ffb7c5")
      .setDescription(`✅ **Successfully restarted ${client.user}!**`);
    return message.channel.send(restartEmbed);
  }
};
