const { RichEmbed } = require("discord.js");
const cheerio = require("cheerio");
const request = require("request");

module.exports = {
  name: "lewd",
  category: "action",
  description: "Lewds a user.",
  usage: "lewd <id or @user>",
  run: async (client, message, args) => {
    const errorEmbed = new RichEmbed();
    const toLewd = message.mentions.members.first() || message.guild.members.get(args[0]);

    if (!toLewd) return message.channel.send(errorEmbed.setColor("#F51B00").setDescription(`❌ **| You must mention a user to lewd!**`)).then(m => m.delete(5000));
    
    var options = {
      url: "http://results.dogpile.com/serp?qc=images&q=" + "anime lewd gif",
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
      
      const lewdEmbed = new RichEmbed()
        .setColor("#38013A")
        .setImage(urls[Math.floor(Math.random() * urls.length)]);
      return message.channel.send(`${message.author} comes and lewds ${toLewd}!`, lewdEmbed);
    });
  }
};
