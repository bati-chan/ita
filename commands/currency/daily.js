const { RichEmbed } = require("discord.js");
const db = require("quick.db");
const ms = require("parse-ms");

module.exports = {
  name: "daily",
  category: "currency",
  description: "Collects your daily currency.",
  run: async (client, message, args) => {
    let emote = await db.fetch(`currencyEmote`);
    if (!emote) emote = null;
    let name = await db.fetch(`currencyName`);
    if (!name) name = null;
    
    const errorEmbed = new RichEmbed().setColor("#F51B00");
    const dailyTime = 1000 * 60 * 60 * 24;
    const amount = 250;
    let dailyWait = await db.fetch(`dailyWait_${message.member.id}`);
    if (!dailyWait) dailyWait = 0;
    let dailyStreak = await db.fetch(`dailyStreak_${message.guild.id}`);
    if (!dailyStreak) dailyStreak = 0;
    
    if (dailyWait && dailyTime - (Date.now() - dailyWait) > 0) {
      const time = ms(dailyTime - (Date.now() - dailyWait));
      return message.channel.send(errorEmbed.setDescription(`❌ **| You must wait \`${time.hours}\`h \`${time.minutes}\`m and \`${time.seconds}\`s before claiming your daily ${emote}${name}(s)!**`)).then(m => m.delete(5000));
    } else {
      let bal = await db.fetch(`balance_${message.member.id}`);
      if (!bal) bal = 0;
      dailyStreak = await db.add(`dailyStreak_${message.member.id}`, 1);
      db.add(`balance_${message.member.id}`, amount);
      db.set(`dailyWait_${message.member.id}`, Date.now());
      
      const dailyEmbed = new RichEmbed()
        .setColor("#ffb7c5")
        .setDescription(`✅ **| Successfully collected your daily ${emote}\`${amount}\` ${name}(s)!**`)
        .setFooter(`Current Streak: ${dailyStreak}`)
      return message.channel.send(dailyEmbed);
    }
  }
}