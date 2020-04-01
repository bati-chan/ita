const { RichEmbed } = require("discord.js");
const malScraper = require("mal-scraper");

module.exports = {
  name: "anime",
  category: "random",
  description: "Shows information about a specific anime.",
  usage: "anime [name]",
  run: async (client, message, args) => {
    const errorEmbed = new RichEmbed().setColor("#F51B00");
    const anime = args.join(" ");
    
    if (!anime) return message.channel.send(errorEmbed.setDescription(`❌ **| You must specify an anime to search!**`)).then(m => m.delete(5000));
    
    malScraper.getInfoFromName(anime).then((res) => {
      if (!message.channel.nsfw) if (res.rating === "Rx - Hentai") return message.channel.send(errorEmbed.setDescription(`❌ **| You must be in an \`NSFW\` channel to search that anime!**`)).then(m => m.delete(5000));
      
      const animeEmbed = new RichEmbed()
        .setColor("#ffb7c5")
        .setAuthor(res.title, "https://cdn.myanimelist.net/img/sp/icon/apple-touch-icon-256.png")
        .setDescription(`[${res.id}](${res.url})\n${res.synopsis || "No description found."}`)
        .addField(`Genres`, `${res.genres.map(g => `\`${g}\``).join(" | ") || "No genres found."}`)
        .addField(`Rating`, `${res.rating || "No rating found."}`, true)
        .addField(`Type`, `${res.type || "No type found."}`, true)
        .addField(`Total Episodes`, `\`${res.episodes || "No episode information found."}\``)
        .addField(`Current Status`, `\`${res.status || "No status information found."}\``, true)
        .addField(`Aired Timing`, `\`${res.aired || "No aired timing information found."}\``, true)
        .setImage(res.picture)
        .setFooter(`Score: ${res.score} | Rank: ${res.ranked} | Popularity: ${res.popularity}`);
      return message.channel.send(animeEmbed);
    }).catch((err) => message.channel.send(errorEmbed.setDescription(`❌ **| There are no animes found named \`${anime}\`!**`)).then(m => m.delete(5000)));
  }
}