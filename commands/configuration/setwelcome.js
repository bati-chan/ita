const { RichEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = {
  name: "setwelcome",
  category: "configuration",
  description: "Sets welcome message of bot.",
  syntax: "<selection> = \`top message\` \`author image\` \`author text\` \`title\` \`description\` \`thumbnail\` \`image\` \`color\` \`footer\` \`timestamp\`",
  usage: "setwelcome [selection]",
  run: async (client, message, args) => {
    let welcomeRole = await db.fetch(`welcomeRole_${message.guild.id}`);
    if (!welcomeRole) welcomeRole = null;
    
    let welcomeChannel = await db.fetch(`welcomeChannel_${message.guild.id}`);
    if (!welcomeChannel) welcomeChannel = null;
    
    const errorEmbed = new RichEmbed().setColor("#F51B00");
    const cancelEmbed = new RichEmbed().setColor("#ffb7c5");
    const selection = args.join(" ");
    const filter = m => m.member.id === message.member.id;
    const successEmbed = new RichEmbed()
      .setColor("#ffb7c5")
      .setDescription(`✅ **| Successfully set \`${selection.toLowerCase()}\` for your welcome message!**`);

    if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send(errorEmbed.setDescription(`❌ **| You do not have permission to use this command!**`)).then(m => m.delete(5000));
    if (!selection) return message.channel.send(errorEmbed.setDescription(`❌ **| You must specify a selection to configure your welcome message!**`)).then(m => m.delete(5000));
    if (!welcomeChannel) return message.channel.send(errorEmbed.setDescription(`❌ **| You must configure a welcome channel first!**`)).then(m => m.delete(5000));

    if (selection.toLowerCase() === "top message") {
      const topEmbed = new RichEmbed()
        .setColor("#ffb7c5")
        .setAuthor(`Custom Welcome Message Configuration`)
        .setThumbnail(client.user.displayAvatarURL)
        .setDescription(`What would you like your ${selection.toLowerCase()} to be?`)
        .addField(`Important Syntax`, `Type \`{user}\` to ping the new member.\nType \`{username}\` to display the new member's username.\nType \`{tag}\` to display the new member's tag.\nType \`{id}\` to display the new member's ID.\nType \`{welcome}\` to ping a welcome role if you configured one.\nType \`{server size}\` to display the member position.`)
        .setImage(`https://cdn.discordapp.com/attachments/554373710627340313/691424881174118430/top_message.PNG`)
        .setFooter(`You may type 'cancel' at any time to cancel configuring your welcome message.`);
      message.channel.send(topEmbed).then(() => message.channel.awaitMessages(filter, { max: 1, time: 1000 * 60 * 5 }).then(top => {
        if (top.first().content.toLowerCase() === "cancel") return message.channel.send(cancelEmbed.setDescription(`✅ **| Successfully cancelled welcome configuration!**`));
        if (top.first().content.includes("{welcome}")) if (!welcomeRole) return message.channel.send(errorEmbed.setDescription(`❌ **| You must configure a welcome role first!**`)).then(m => m.delete(5000));
        const topMessage = top.first().content;
        db.set(`welcomeTop_${message.guild.id}`, topMessage);
        return message.channel.send(successEmbed);
      })).catch(e => console.log(e));
    } else if (selection.toLowerCase() === "author image") {
      const authorPicEmbed = new RichEmbed()
        .setColor("#ffb7c5")
        .setAuthor(`Custom Welcome Message Configuration`)
        .setThumbnail(client.user.displayAvatarURL)
        .setDescription(`What would you like your ${selection.toLowerCase()} to be?`)
        .addField(`Important Syntax`, `Type \`{avatar}\` to display the user's avatar.\n You may also attach an image link as well to configure a custom image.`)
        .setImage(`https://cdn.discordapp.com/attachments/554373710627340313/691427418044497950/author_picture.PNG`)
        .setFooter(`You may type 'cancel' at any time to cancel configuring your welcome message.`);
      message.channel.send(authorPicEmbed).then(() => message.channel.awaitMessages(filter, { max: 1, time: 1000 * 60 * 5 }).then(authorPic => {
        if (authorPic.first().content.toLowerCase() === "cancel") return message.channel.send(cancelEmbed.setDescription(`✅ **| Successfully cancelled welcome configuration!**`));
        const authorImage = authorPic.first().content;
        db.set(`welcomeAuthorPicture_${message.guild.id}`, authorImage);
        return message.channel.send(successEmbed);
      })).catch(e => console.log(e));
    } else if (selection.toLowerCase() === "author text") {
      const authorTextEmbed = new RichEmbed()
        .setColor("#ffb7c5")
        .setAuthor(`Custom Welcome Message Configuration`)
        .setThumbnail(client.user.displayAvatarURL)
        .setDescription(`What would you like your ${selection.toLowerCase()} to be?`)
        .setImage(`https://cdn.discordapp.com/attachments/554373710627340313/691447669620604938/author_text.PNG`)
        .setFooter(`You may type 'cancel' at any time to cancel configuring your welcome message.`);
      message.channel.send(authorTextEmbed).then(() => message.channel.awaitMessages(filter, { max: 1, time: 1000 * 60 * 5 }).then(authText => {
        if (authText.first().content.toLowerCase() === "cancel") return message.channel.send(cancelEmbed.setDescription(`✅ **| Successfully cancelled welcome configuration!**`));
        const authorText = authText.first().content;
        db.set(`authorText_${message.guild.id}`, authorText);
        return message.channel.send(successEmbed);
      })).catch(e => console.log(e));
    } else if (selection.toLowerCase() === "title") {
      const titleEmbed = new RichEmbed()
        .setColor("#ffb7c5")
        .setAuthor(`Custom Welcome Message Configuration`)
        .setThumbnail(client.user.displayAvatarURL)
        .setDescription(`What would you like your ${selection.toLowerCase()} to be?`)
        .addField(`Important Syntax`, `Type \`{username}\` to display the new member's username.\nType \`{tag}\` to display the new member's tag.\nType \`{id}\` to display the new member's ID.`)
        .setImage(`https://cdn.discordapp.com/attachments/554373710627340313/691448805979062272/title.PNG`)
        .setFooter(`You may type 'cancel' at any time to cancel configuring your welcome message.`);
      message.channel.send(titleEmbed).then(() => message.channel.awaitMessages(filter, { max: 1, time: 1000 * 60 * 5 }).then(title => {
        if (title.first().content.toLowerCase() === "cancel") return message.channel.send(cancelEmbed.setDescription(`✅ **| Successfully cancelled welcome configuration!**`));
        const welcomeTitle = title.first().content;
        db.set(`welcomeTitle_${message.guild.id}`, welcomeTitle);
        return message.channel.send(successEmbed);
      })).catch(e => console.log(e));
    } else if (selection.toLowerCase() === "description") {
      const descEmbed = new RichEmbed()
        .setColor("#ffb7c5")
        .setAuthor(`Custom Welcome Message Configuration`)
        .setThumbnail(client.user.displayAvatarURL)
        .setDescription(`What would you like your ${selection.toLowerCase()} to be?`)
        .addField(`Important Syntax`, `Type \`{username}\` to display the new member's username.\nType \`{tag}\` to display the new member's tag.\nType \`{id}\` to display the new member's ID.`)
        .setImage(`https://cdn.discordapp.com/attachments/554373710627340313/691450690471460934/description.PNG`)
        .setFooter(`You may type 'cancel' at any time to cancel configuring your welcome message.`);
      message.channel.send(descEmbed).then(() => message.channel.awaitMessages(filter, { max: 1, time: 1000 * 60 * 5 }).then(desc => {
        if (desc.first().content.toLowerCase() === "cancel") return message.channel.send(cancelEmbed.setDescription(`✅ **| Successfully cancelled welcome configuration!**`));
        const welcomeDesc = desc.first().content;
        db.set(`welcomeDesc_${message.guild.id}`, welcomeDesc);
        return message.channel.send(successEmbed);
      })).catch(e => console.log(e));
    } else if (selection.toLowerCase() === "thumbnail") {
      const thumbnailEmbed = new RichEmbed()
        .setColor("#ffb7c5")
        .setAuthor(`Custom Welcome Message Configuration`)
        .setThumbnail(client.user.displayAvatarURL)
        .setDescription(`What would you like your ${selection.toLowerCase()} to be?`)
        .addField(`Important Syntax`, `Type \`{avatar}\` to display the user's avatar.\n You may also attach an image link as well to configure a custom thumbnail.`)
        .setImage(`https://cdn.discordapp.com/attachments/554373710627340313/691452125275750420/thumbnail.PNG`)
        .setFooter(`You may type 'cancel' at any time to cancel configuring your welcome message.`);
      message.channel.send(thumbnailEmbed).then(() => message.channel.awaitMessages(filter, { max: 1, time: 1000 * 60 * 5 }).then(thumbnail => {
        if (thumbnail.first().content.toLowerCase() === "cancel") return message.channel.send(cancelEmbed.setDescription(`✅ **| Successfully cancelled welcome configuration!**`));
        const welcomeThumbnail = thumbnail.first().content;
        db.set(`welcomeThumbnail_${message.guild.id}`, welcomeThumbnail);
        return message.channel.send(successEmbed);
      })).catch(e => console.log(e));
    } else if (selection.toLowerCase() === "image") {
      const imageEmbed = new RichEmbed()
        .setColor("#ffb7c5")
        .setAuthor(`Custom Welcome Message Configuration`)
        .setThumbnail(client.user.displayAvatarURL)
        .setDescription(`What would you like your ${selection.toLowerCase()} to be?`)
        .addField(`Important Syntax`, `You may attach an image link to configure a custom image.`)
        .setImage(`https://cdn.discordapp.com/attachments/554373710627340313/691453712341794866/image.PNG`)
        .setFooter(`You may type 'cancel' at any time to cancel configuring your welcome message.`);
      message.channel.send(imageEmbed).then(() => message.channel.awaitMessages(filter, { max: 1, time: 1000 * 60 * 5 }).then(image => {
        if (image.first().content.toLowerCase() === "cancel") return message.channel.send(cancelEmbed.setDescription(`✅ **| Successfully cancelled welcome configuration!**`));
        const welcomeImage = image.first().content;
        db.set(`welcomeImage_${message.guild.id}`, welcomeImage);
        return message.channel.send(successEmbed);
      })).catch(e => console.log(e));
    } else if (selection.toLowerCase() === "color") {
      const colorEmbed = new RichEmbed()
        .setColor("#ffb7c5")
        .setAuthor(`Custom Welcome Message Configuration`)
        .setThumbnail(client.user.displayAvatarURL)
        .setDescription(`What would you like your ${selection.toLowerCase()} to be?`)
        .addField(`Important Syntax`, `You must type your preferred color by [Color Hex](https://www.color-hex.com/).`)
        .setImage(`https://cdn.discordapp.com/attachments/554373710627340313/691456254790336532/color.PNG`)
        .setFooter(`You may type 'cancel' at any time to cancel configuring your welcome message.`);
      message.channel.send(colorEmbed).then(() => message.channel.awaitMessages(filter, { max: 1, time: 1000 * 60 * 5 }).then(color => {
        if (color.first().content.toLowerCase() === "cancel") return message.channel.send(cancelEmbed.setDescription(`✅ **Successfully cancelled welcome configuration!**`));
        const welcomeColor = color.first().content;
        db.set(`welcomeColor_${message.guild.id}`, welcomeColor);
        return message.channel.send(successEmbed);
      })).catch(e => console.log(e));
    } else if (selection.toLowerCase() === "footer") {
      const footerEmbed = new RichEmbed()
        .setColor("#ffb7c5")
        .setAuthor(`Custom Welcome Message Configuration`)
        .setThumbnail(client.user.displayAvatarURL)
        .setDescription(`What would you like your ${selection.toLowerCase()} to be?`)
        .addField(`Important Syntax`, `Type \`{server size}\` to display the member position.`)
        .setImage(`https://cdn.discordapp.com/attachments/554373710627340313/691458368837124146/footer.png`)
        .setFooter(`You may type 'cancel' at any time to cancel configuring your welcome message.`);
      message.channel.send(footerEmbed).then(() => message.channel.awaitMessages(filter, { max: 1, time: 1000 * 60 * 5 }).then(footer => {
        if (footer.first().content.toLowerCase() === "cancel") return message.channel.send(cancelEmbed.setDescription(`✅ **| Successfully cancelled welcome configuration!**`));
        const welcomeFooter = footer.first().content;
        db.set(`welcomeFooter_${message.guild.id}`, welcomeFooter);
        return message.channel.send(successEmbed);
      })).catch(e => console.log(e));
    } else if (selection.toLowerCase() === "timestamp") {
      const timeEmbed = new RichEmbed()
        .setColor("#ffb7c5")
        .setAuthor(`Custom Welcome Message Configuration`)
        .setThumbnail(client.user.displayAvatarURL)
        .setDescription(`Would you like a ${selection.toLowerCase()}?`)
        .addField(`Important Syntax`, `You must type either \`yes\` to set a timestamp or \`no\` to disable a timestamp.`)
        .setImage(`https://cdn.discordapp.com/attachments/554373710627340313/691462262514384946/timestamp.png`)
        .setFooter(`You may type 'cancel' at any time to cancel configuring your welcome message.`);
      message.channel.send(timeEmbed).then(() => message.channel.awaitMessages(filter, { max: 1, time: 1000 * 60 * 5 }).then(time => {
        if (time.first().content.toLowerCase() === "cancel") return message.channel.send(cancelEmbed.setDescription(`✅ **| Successfully cancelled welcome configuration!**`));
        else if (time.first().content.toLowerCase() === "yes") db.set(`welcomeTimestamp_${message.guild.id}`, true);
        else if (time.first().content.toLowerCase() === "no") db.set(`welcomeTimestamp_${message.guild.id}`, false);
        else return message.channel.send(errorEmbed.setDescription(`❌ **| You must specify a valid choice to configure a timestamp in your welcome message!**`)).then(m => m.delete(5000));
        return message.channel.send(successEmbed);
      })).catch(e => console.log(e));
    } else return message.channel.send(errorEmbed.setDescription(`❌ **| You must specify a valid selection to configure your welcome message!**`)).then(m => m.delete(5000));
  }
}