const { RichEmbed } = require("discord.js");
const urban = require("urban");

module.exports = {
  name: "urban",
  category: "random",
  description: "Defines a word with urban dictionary.",
  usage: "urban [word]",
  run: async (client, message, args) => {
    const errorEmbed = new RichEmbed();
    const term = urban(args.join(" "));
    
    if (!message.channel.nsfw) return message.channel.send(errorEmbed.setDescription(`❌ **| You must be in an \`NSFW\` channel to use urban dictionary!**`)).then(m => m.delete(5000));
    if (!args[0]) return message.channel.send(errorEmbed.setDescription(`❌ **| You must specify a term to use urban dictionary!**`)).then(m => m.delete(5000));
    
    try {
      term.first(search => {
        if (!search) return message.channel.send(errorEmbed.setDescription(`❌ **| That term is not in the urban dictionary!**`)).then(m => m.delete(5000));
        let { word, definition, example, thumbs_up, thumbs_down, permalink, author } = search;
        if (example.length > 1024) example = "This message is too long, please refer to the link above.";
        const searchEmbed = new RichEmbed()
          .setColor("#ffb7c5")
          .setAuthor(word.slice(0, 1).toUpperCase() + word.slice(1), "https://img.utdstc.com/icons/urban-dictionary-android.png")
          .setDescription(`${definition || "No definition found."}\n[Link](${permalink})`)
          .addField(`Example`, `${example || "No example found."}`)
          .addField(`Author`, `${author || "No author found."}`)
          .setFooter(`👍: ${thumbs_up || 0} | 👎: ${thumbs_down || 0}`);
        return message.channel.send(searchEmbed);
      });
    } catch(e) {
      console.log(e);
    }
  }
}