const { createCanvas, loadImage } = require("canvas");
const { Attachment } = require("discord.js");
const { RichEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = {
  name: "verify",
  category: "verification",
  description: "Verifies you into the server.",
  usage: "verify (id or @user)",
  run: async (client, message, args) => {
    message.delete();
    const errorEmbed = new RichEmbed().setColor("#F51B00");
    const member = message.mentions.members.first() || message.guild.members.get(args[0]);

    if (member) {
      if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(errorEmbed.setDescription(`❌ **| You do not have permission to use this command!**`)).then(m => m.delete(5000));
      if (member.user.id === message.member.id) return message.channel.send(errorEmbed.setDescription(`❌ **| You are not able to override verify yourself!**`)).then(m => m.delete(5000));

      let verifyRole = await db.fetch(`verifyRole_${message.guild.id}`);
      if (verifyRole) verifyRole = message.guild.roles.get(verifyRole);
      else return message.channel.send(errorEmbed.setDescription(`❌ **| There is no verified role configured yet!**`)).then(m => m.delete(5000));

      member.addRole(verifyRole);

      const successEmbed = new RichEmbed()
        .setColor("#ffb7c5")
        .setDescription(`✅ **| Successfully overrode verified ${member.user}!**`);
      message.channel.send(successEmbed);
      return console.log(`${member.user.tag} has been overrode verified by ${message.author.tag}`);
    } else {
      let verifyChannel = await db.fetch(`verifyChannel_${message.guild.id}`);
      if (verifyChannel) verifyChannel = client.channels.get(verifyChannel);
      else return;
      let verifyRole = await db.fetch(`verifyRole_${message.guild.id}`);
      if (verifyRole) verifyRole = message.guild.roles.get(verifyRole);
      else return;
    
      if (message.channel.id !== verifyChannel.id) return message.channel.send(errorEmbed.setDescription(`❌ **| You are not in the correct channel to verify!**`)).then(m => m.delete(5000));
      if (message.member.roles.has(verifyRole.id)) return message.channel.send(errorEmbed.setDescription(`❌ **| You are already verified in the server!**`)).then(m => m.delete(5000));
    
      const captcha = Math.random().toString(36).substr(2, 5);
      const canvas = createCanvas(1000, 333);
      const ctx = canvas.getContext("2d");

      const background = await loadImage("https://i.pinimg.com/originals/57/c2/62/57c262fa445b9051ded9e0dff0e58745.jpg");
      ctx.drawImage(background, 0, 0, canvas.width, canvas.height);

      ctx.strokeStyle = "##ffb7c5";
      ctx.strokeRect(0, 0, canvas.width, canvas.height);

      ctx.font = "150px Courier New";
      ctx.fillStyle = "#ffb7c5";
      ctx.fillText(captcha, canvas.width / 3.6, canvas.height / 1.6 );

      const attachment = new Attachment(canvas.toBuffer(), "verify.png"); 
      try { 
        const filter = m => m.author.id === message.author.id;
        const sentDM = await message.author.send("Please enter the following captcha to finish vertification.", attachment);
        const dms = await message.author.createDM();
        const sentEmbed = new RichEmbed()
          .setColor("#ffb7c5")
          .setDescription(`✅ **| Please check your DMs to finish verification!**`);
        message.channel.send(sentEmbed).then(m => m.delete(10000));
        const answer = await dms.awaitMessages(filter, { max: 1, time: 1000 * 30 }).then(ans => {
          if (ans.first().content.toLowerCase() === captcha) {
            message.member.addRole(verifyRole);
            const verifiedEmbed = new RichEmbed()
              .setColor("#ffb7c5")
              .setDescription(`✅ **| Successfully completed verification for ${message.guild.name}!**`);
            message.member.send(verifiedEmbed);
            return console.log(`${message.author.tag} completed Verification.`)
          } else {
            message.member.send(errorEmbed.setDescription(`❌ **| You guessed incorrectly! Please try again!**`));
            return console.log(`${message.author.tag} failed Verification. \nReason: Incorrect Answer`)
          }
        }).catch(e => {
          message.member.send(errorEmbed.setDescription(`❌ **| You did not verify in time! Please try again!**`));
          return console.log(`${message.author.tag} failed Verification. \nReason: ${e}`);
        });
      } catch(e) {
        console.log(e);
        return message.channel.send(errorEmbed.setDescription(`❌ **| You must have your DMs open to verify!**`)).then(m => m.delete(5000));
      }
    }
  }
}