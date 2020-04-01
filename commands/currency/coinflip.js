const { RichEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = {
  name: "coinflip",
  aliases: ["cf"],
  category: "currency",
  description: "Flips a coin and randomly selects heads or tails.",
  usage: "coinflip [amount] [heads/tails]",
  run: async (client, message, args) => {
    const errorEmbed = new RichEmbed().setColor("#F51B00");
    const amount = parseInt(args[0]);
    let choice = args[1];
    
    let emote = await db.fetch(`currencyEmote`);
    if (!emote) emote = null;
    let name = await db.fetch(`currencyName`);
    if (!name) name = null;
    let bal = await db.fetch(`balance_${message.member.id}`);
    if (!bal) bal = 0;
    
    if (!amount) return message.channel.send(errorEmbed.setDescription(`❌ **| You must specify an amount to coinflip ${emote}${name}(s)!**`)).then(m => m.delete(5000));
    if (!choice) return message.channel.send(errorEmbed.setDescription(`❌ **| You must specify either heads or tails to coinflip ${emote}${name}(s)!**`)).then(m => m.delete(5000));
    if (amount > bal) return message.channel.send(errorEmbed.setDescription(`❌ **| You must specify a smaller amount to coinflip ${emote}${name}(s)!**`)).then(m => m.delete(5000));
    
    if (choice === "h") choice = "heads";
    else if (choice === "t") choice = "tails";
    else return message.channel.send(errorEmbed.setDescription(`❌ **| You must specify either heads or tails to coinflip ${emote}${name}(s)!**`)).then(m => m.delete(5000));
    
    let headsOrTails = ["heads", "tails"];
    headsOrTails = headsOrTails[Math.floor(Math.random() * headsOrTails.length)];
    
    if (headsOrTails === choice) {
      await db.add(`balance_${message.member.id}`, amount);
      const winEmbed = new RichEmbed()
        .setColor("#ffb7c5")
        .setAuthor(`The coin landed on: ${headsOrTails.slice(0, 1).toUpperCase() + headsOrTails.slice(1)}`)
        .setDescription(`**You guessed right! You won ${emote}\`${amount * 2}\` ${name}(s)!**`)
      return message.channel.send(winEmbed);
    } else {
      await db.subtract(`balance_${message.member.id}`, amount);
      const loseEmbed = new RichEmbed()
        .setColor("#F51B00")
        .setAuthor(`The coin landed on: ${headsOrTails.slice(0, 1).toUpperCase() + headsOrTails.slice(1)}`)
        .setDescription(`**Better luck next time! You lost ${emote}\`${amount}\` ${name}(s)!**`);
      return message.channel.send(loseEmbed);
    }
  }
}