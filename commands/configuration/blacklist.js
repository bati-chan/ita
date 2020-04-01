const { RichEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = {
  name: "blacklist",
  aliases: ["bl"],
  category: "configuration",
  description: "Blacklists a user from using bot commands.",
  usage: "blacklist [id or @user/word] [add/remove] (word of choice)",
  run: async (client, message, args) => {
    const errorEmbed = new RichEmbed().setColor("#F51B00");
    const option = args[1];
    
    if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(errorEmbed.setDescription(`❌ **| You do not have permission to use this command!**`)).then(m => m.delete(5000));
    if (!args[0]) return message.channel.send(errorEmbed.setDescription(`❌ **| You must specify what you want to blacklist!**`)).then(m => m.delete(5000));
    if (!option) return message.channel.send(errorEmbed.setDescription(`❌ **| You must specify either \`add\` or \`remove\`!**`)).then(m => m.delete(5000)); 
    
    if (args[0] === "word") {
      let badWords = await db.fetch(`blacklistWords_${message.guild.id}`);
      if (!badWords) badWords = null;
      
      const word = args.slice(2).join(" ");
      
      if (!word) return message.channel.send(errorEmbed.setDescription(`❌ **| You must specify a word to blacklist!**`)).then(m => m.delete(5000));
      
      if (option === "add") {
        try {
          if (badWords.includes(word)) return message.channel.send(errorEmbed.setDescription(`❌ **| This word is already blacklisted in this server!**`)).then(m => m.delete(5000));
        } catch(e) {
        
        }
        await db.push(`blacklistWords_${message.guild.id}`, word);
        const successEmbed = new RichEmbed()
          .setColor("#ffb7c5")
          .setDescription(`✅ **| Successfully added \`${word}\` to blacklist!**`);
        return message.channel.send(successEmbed);
      } else if (option === "remove") {
        try {
          if (!badWords.includes(word)) return message.channel.send(errorEmbed.setDescription(`❌ **| This word is not blacklisted in this server!**`)).then(m => m.delete(5000));
        } catch(e) {
          
        }
        await db.delete(`blacklistWords_${message.guild.id}`, word);
        const successEmbed = new RichEmbed()
          .setColor("#ffb7c5")
          .setDescription(`✅ **| Successfully removed \`${word}\` from blacklist!**`);
        return message.channel.send(successEmbed);
      } else return message.channel.send(errorEmbed.setDescription(`❌ **| You must specify either \`add\` or \`remove\`!**`)).then(m => m.delete(5000)); 
    } else {
      let blacklisted = await db.fetch(`blacklistMembers_${message.guild.id}`);
      if (!blacklisted) blacklisted = null;
      
      const member = message.mentions.members.first() || message.guild.members.get(args[0]);
      
      if (!member) return message.channel.send(errorEmbed.setDescription(`❌ **| You must mention a user to blacklist!**`)).then(m => m.delete(5000));
      if (member.user.id === message.member.id) return message.channel.send(errorEmbed.setDescription(`❌ **| You are not able to blacklist yourself!**`)).then(m => m.delete(5000));
      if (member.user.id === process.env.OWNER) return message.channel.send(errorEmbed.setDescription(`❌ **| You are not able to blacklist that user!**`)).then(m => m.delete(5000));
      if (member.highestRole.position >= message.member.highestRole.position) return message.channel.send(errorEmbed.setDescription(`❌ **| You are not able to blacklist that user!**`)).then(m => m.delete(5000));
    
      if (option === "add") {
        try {
          if (blacklisted.includes(member.user.id)) return message.channel.send(errorEmbed.setDescription(`❌ **| This user is already blacklisted from my bot commands!**`)).then(m => m.delete(5000));
        } catch(e) {
        
        }
        await db.push(`blacklistMembers_${message.guild.id}`, member.user.id);
        const successEmbed = new RichEmbed()
          .setColor("#ffb7c5")
          .setDescription(`✅ **| Successfully added ${member.user} to blacklist!**`);
        return message.channel.send(successEmbed);
      } else if (option === "remove") {
        try {
          if (!blacklisted.includes(member.user.id)) return message.channel.send(errorEmbed.setDescription(`❌ **| This user is not blacklisted from my bot commands!**`)).then(m => m.delete(5000));
        } catch(e) {
          
        }
        await db.delete(`blacklistMembers_${message.guild.id}`, member.user.id);
        const successEmbed = new RichEmbed()
          .setColor("#ffb7c5")
          .setDescription(`✅ **| Successfully removed ${member.user} from blacklist!**`);
        return message.channel.send(successEmbed);
      } else return message.channel.send(errorEmbed.setDescription(`❌ **| You must specify either \`add\` or \`remove\`!**`)).then(m => m.delete(5000)); 
    }
  }
}