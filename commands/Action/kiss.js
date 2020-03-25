const { RichEmbed } = require("discord.js");
const cheerio = require("cheerio");
const request = require("request");

module.exports = {
  name: "kiss",
  category: "action",
  description: "Kisses a user.",
  usage: "kiss <id or @user>",
  run: async (client, message, args) => {
    const errorEmbed = new RichEmbed();
    const toKiss = message.mentions.members.first() || message.guild.members.get(args[0]);
    if (!args[0]) {
      const aloneEmbed = new RichEmbed()
        .setColor("#38013A")
        .setImage("https://i.pinimg.com/originals/8c/ab/4f/8cab4f4c73547d077c56066461c40a5e.gif");
      return message.channel.send(`Aww, it's okay ${message.author}! I'll be here to kiss you!~`, aloneEmbed);
    }
    if (!toKiss) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| You must mention a user to kiss!**`)).then(m => m.delete(5000));
    
    var options = {
      url: "http://results.dogpile.com/serp?qc=images&q=" + "anime kiss gif",
      method: "GET",
      headers: {
        Accept: "text/html",
        "User-Agent": "Chrome"
      }
    };
    request (options, function(error, response, responseBody) {
      if (error) return; 
      $ = cheerio.load(responseBody);
      var links = $(".image a.link");
      var urls = new Array(links.length)
        .fill(0)
        .map((v, i) => links.eq(i).attr("href"));
      if (!urls.length) return;
      
      const kissEmbed = new RichEmbed()
        .setColor("#38013A")
        .setImage(urls[Math.floor(Math.random() * urls.length)]);
      return message.channel.send(`${message.author} comes and kisses ${toKiss}! How wholesome!~`, kissEmbed);
    });
  }
};
