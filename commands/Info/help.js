const { RichEmbed } = require("discord.js");
const fs = require("fs");
const db = require("quick.db");

module.exports = {
  name: "help",
  category: "info",
  description: "Explains about a specific commands or about all commands.",
  usage: "help <command>",
  run: async (client, message, args) => {
    let prefix = await db.fetch(`prefix_${message.guild.id}`);
    if (!prefix) prefix = process.env.PREFIX;
    
    const helpCommand = client.commands.get("help").usage;
    const owner = message.guild.members.get(process.env.OWNER);
    
    if (args[0]) {
      const errorEmbed = new RichEmbed();
      const embed = new RichEmbed();
      const cmd = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));

      if (!cmd) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| You must specify a valid command!**`).setFooter(`To open the full list of commands, use ${prefix}${helpCommand}`));
            
      const usage = cmd.usage;
      if (cmd.category) embed.addField("Category",`${cmd.category.charAt(0).toUpperCase() + cmd.category.slice(1)}`);
      if (cmd.aliases) embed.addField("Aliases", cmd.aliases.map(a => `\`{a}\``).join(" "));
      if (cmd.description) embed.setDescription(cmd.description);
      if (cmd.usage) embed.addField("Usage", `\`${prefix}${usage}\``);
      if (cmd.syntax) embed.addField("Important Syntax", cmd.syntax);
            
      return message.channel.send(embed.setColor("#38013A").setTitle(cmd.name.charAt(0).toUpperCase() + cmd.name.slice(1)).setFooter(owner.user.tag, owner.user.displayAvatarURL));
    } else {
      const categories = fs.readdirSync("./commands/")
      const owner = message.guild.members.get(process.env.OWNER);
      
      const allEmbed = new RichEmbed()
        .setColor("#38013A")
        .setThumbnail(client.user.displayAvatarURL)
        .setTitle(`${client.user.username}'s Bot Commands`)
        .setDescription(`To get information of a specific command, use \`${prefix}${helpCommand}\``)
        .setFooter(owner.user.tag, owner.user.displayAvatarURL);
      
      categories.forEach(category => {
          const dir = client.commands.filter(c => c.category === category)
          const capitalise = category.slice(0, 1).toUpperCase() + category.slice(1)
          try {
              allEmbed.addField(capitalise, dir.map(c => `\`${c.name}\``).join(" "))
          } catch(e) {
              console.log(e);
          }
      });
      allEmbed.addField(`Not Ready`, `I'm so sorry this didn't work! ${owner} is currently trying to finish mapping every command possible, but if you need more help, just ask him!`);
      return message.channel.send(allEmbed)
    }
  }
 }
