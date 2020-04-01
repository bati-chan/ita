const { RichEmbed } = require("discord.js");
const db = require("quick.db");

module.exports = async (client, member) => {
  const serverSize = client.guilds.get(member.guild.id).members.filter(m => !m.user.bot).size;
  let welcomeChannel = await db.fetch(`welcomeChannel_${member.guild.id}`);
  if (!welcomeChannel) return;
  else welcomeChannel = client.channels.get(welcomeChannel);
  let welcomeRole = await db.fetch(`welcomeRole_${member.guild.id}`);
  if (!welcomeRole) welcomeRole = null;
  else welcomeRole = member.guild.roles.get(welcomeRole);
  let topMessage = await db.fetch(`welcomeTop_${member.guild.id}`);
  if (!topMessage) topMessage = null; 
  let authorImage = await db.fetch(`welcomeAuthorPicture_${member.guild.id}`);
  if (!authorImage) authorImage = null;
  let authorText = await db.fetch(`authorText_${member.guild.id}`);
  if (!authorText) authorText = null;
  let title = await db.fetch(`welcomeTitle_${member.guild.id}`);
  if (!title) title = null;
  let description = await db.fetch(`welcomeDesc_${member.guild.id}`);
  if (!description) description = null;
  let thumbnail = await db.fetch(`welcomeThumbnail_${member.guild.id}`);
  if (!thumbnail) thumbnail = null;
  let image = await db.fetch(`welcomeImage_${member.guild.id}`);
  if (!image) image = null
  let color = await db.fetch(`welcomeColor_${member.guild.id}`);
  if (!color) color = null;
  let footer = await db.fetch(`welcomeFooter_${member.guild.id}`);
  if (!footer) footer = null;
  let timestamp = await db.fetch(`welcomeTimestamp_${member.guild.id}`);
  if (!timestamp) timestamp = null;
  
  const welcomeEmbed = new RichEmbed();
  
  if (topMessage) {
    if (topMessage.includes("{welcome}")) topMessage = topMessage.replace("{welcome}", welcomeRole);
    if (topMessage.includes("{user}")) topMessage = topMessage.replace("{user}", member.user);
    if (topMessage.includes("{username}")) topMessage = topMessage.replace("{username}", member.user.username);
    if (topMessage.includes("{tag}")) topMessage = topMessage.replace("{tag}", member.user.tag);
    if (topMessage.includes("{id}")) topMessage = topMessage.replace("{id}", member.user.id);
    if (topMessage.includes("{server size}")) topMessage = topMessage.replace("{server size}", serverSize);
  }
  if (authorImage) if (authorImage.includes("{avatar}")) authorImage = authorImage.replace("{avatar}", member.user.displayAvatarURL);
  if (title) {
    if (title.includes("{username}")) title = title.replace("{username}", member.user.username);
    if (title.includes("{tag}")) title = title.replace("{tag}", member.user.tag);
    if (title.includes("{id}")) title = title.replace("{id}", member.user.id);
    if (title.includes("{server size}")) title = title.replace("{server size}", serverSize);
  }
  if (description) {
    if (description.includes("{username}")) description = description.replace("{username}", member.user.username);
    if (description.includes("{tag}")) description = description.replace("{tag}", member.user.tag);
    if (description.includes("{id}")) description = description.replace("{id}", member.user.id);
  }
  if (thumbnail) if (thumbnail.includes("{avatar}")) thumbnail = thumbnail.replace("{avatar}", member.user.displayAvatarURL);
  if (footer) if (footer.includes("{server size}")) footer = footer.replace("{server size}", serverSize);
  
  try {
    if (authorImage) welcomeEmbed.setAuthor(authorImage);
    if (authorText) welcomeEmbed.setAuthor(authorText);
    if (title) welcomeEmbed.setTitle(title);
    if (description) welcomeEmbed.setDescription(description);
    if (thumbnail) welcomeEmbed.setThumbnail(thumbnail);
    if (image) welcomeEmbed.setImage(image);
    if (color) welcomeEmbed.setColor(color);
    if (footer) welcomeEmbed.setFooter(footer);
    if (timestamp) welcomeEmbed.setTimestamp();
    if (topMessage) return welcomeChannel.send(topMessage, welcomeEmbed);
    else return welcomeChannel.send(welcomeEmbed);
  } catch(e) {
    console.log(e);
  }
}