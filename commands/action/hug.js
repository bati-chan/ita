const { RichEmbed } = require("discord.js");
const cheerio = require("cheerio");
const request = require("request");

module.exports = {
  name: "hug",
  category: "action",
  description: "Hugs a user.",
  usage: "hug (id or @user)",
  run: async (client, message, args) => {
    const errorEmbed = new RichEmbed().setColor("#F51B00");
    const toHug = message.mentions.members.first() || message.guild.members.get(args[0]);

    if (!args[0]) {
      const aloneEmbed = new RichEmbed().setColor("#ffb7c5").setImage("https://media.giphy.com/media/Y4z9olnoVl5QI/giphy.gif");
      return message.channel.send(`Aww, it's okay ${message.author}! I'll be here to hug you!~`, aloneEmbed);
    }
    if (!toHug) return message.channel.send(errorEmbed.setDescription(`❌ **| You must mention a user to hug!**`)).then(m => m.delete(5000));
    
    var options = {
      url: "http://results.dogpile.com/serp?qc=images&q=" + "anime hug gif",
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
      
      const hugEmbed = new RichEmbed()
        .setColor("#ffb7c5")
        .setImage(urls[Math.floor(Math.random() * urls.length)]);
      return message.channel.send(`${message.author} comes and hugs ${toHug}! How wholesome!~`, hugEmbed);
    });
  }
};
