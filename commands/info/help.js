const { RichEmbed } = require("discord.js");
const fs = require("fs");
const db = require("quick.db");

module.exports = {
  name: "help",
  category: "info",
  description: "Explains about a specific commands or about all commands.",
  usage: "help (command)",
  run: async (client, message, args) => {
    let prefix = await db.fetch(`prefix_${message.guild.id}`);
    if (!prefix) prefix = process.env.PREFIX;
    
    const helpCommand = client.commands.get("help").usage;
    const owner = message.guild.members.get(process.env.OWNER);
    
    if (args[0]) {
      const errorEmbed = new RichEmbed().setColor("#F51B00");
      const commandEmbed = new RichEmbed();
      const command = client.commands.get(args[0]) || client.commands.get(client.aliases.get(args[0]));
      const usage = command.usage;

      if (!command) return message.channel.send(errorEmbed.setDescription(`❌ **| You must specify a valid command!**`).setFooter(`To open the full list of commands, use ${prefix}${helpCommand}`));
            
      if (command.category) commandEmbed.addField("Category",`${command.category.charAt(0).toUpperCase() + command.category.slice(1)}`);
      if (command.aliases) commandEmbed.addField("Aliases", command.aliases.map(a => `\`${a}\``).join(" "));
      if (command.description) commandEmbed.setDescription(command.description);
      if (command.usage) commandEmbed.addField("Usage", `\`${prefix}${usage}\``);
      if (command.syntax) commandEmbed.addField("Important Syntax", command.syntax);
            
      return message.channel.send(commandEmbed.setColor("#ffb7c5").setTitle(command.name.slice(0, 1).toUpperCase() + command.name.slice(1)).setFooter(`[] = Required | () = Optional`, client.user.displayAvatarURL));
    } else {
      const categories = fs.readdirSync("./commands/");
      const allEmbed = new RichEmbed()
        .setColor("#ffb7c5")
        .setThumbnail(client.user.displayAvatarURL)
        .setTitle(`${client.user.username}'s Bot Commands`)
        .setDescription(`To get information of a specific command, use \`${prefix}${helpCommand}\``)
        .setFooter(`❧ bati#0001`, client.user.displayAvatarURL);
      
      categories.forEach(category => {
        const commands = client.commands.filter(c => c.category === category.toLowerCase()).map(c => `\`${c.name}\``).join(" | ");
        const capitalise = category.slice(0, 1).toUpperCase() + category.slice(1);
        
        try {
          allEmbed.addField(capitalise, commands);
        } catch(e) {
          console.log(e);
        }
      });
      return message.channel.send(allEmbed);
    }
  }
 }
