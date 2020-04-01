const { RichEmbed } = require("discord.js");
const translate = require("@vitalets/google-translate-api");

module.exports = {
  name: "translate",
  aliases: ["trans"],
  category: "random",
  description: "Translates input into any language of choice.",
  usage: "translate [language] [input]",
  run: async (client, message, args) => {
    const errorEmbed = new RichEmbed().setColor("#F51B00");
    const language = args[0];
    const input = args.slice(1).join(" ");
    
    if (!language) return message.channel.send(errorEmbed.setDescription(`❌ **| You must specify a language to translate into!**`)).then(m => m.delete(5000));
    if (!input) return message.channel.send(errorEmbed.setDescription(`❌ **| You must input what you want to translate!**`)).then(m => m.delete(5000));
  
    translate(input, { to: language }).then(result => {
      const transEmbed = new RichEmbed()
        .setColor("#ffb7c5")
        .setAuthor(language.slice(0, 1).toUpperCase() + language.slice(1))
        .setDescription(result.text);
      return message.channel.send(transEmbed);
    }).catch(err => message.channel.send(errorEmbed.setDescription(`❌ **| You must specify a valid language to translate into!**`)).then(m => m.delete(5000)));
  }
}