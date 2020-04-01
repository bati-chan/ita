const fs = require("fs");
const db = require('quick.db');

module.exports = async (client, message) => {
  console.log(`${client.user.username} is up online!`);
  client.generateInvite("ADMINISTRATOR").then(inviteLink => console.log(`Invite: ${inviteLink}`));
        
  client.user.setPresence({
    status: "idle",
    game: {
      name: `Kantai Collection`,
      type: `PLAYING`
    }
  });

  setInterval(async () => {
    for (const i in client.mutes) {
      const time = client.mutes[i].time;
      const guildId = client.mutes[i].guild;
      const guild = client.guilds.get(guildId); 
      const member = guild.members.get(i);
      let muteRole = await db.fetch(`muteRole_${guildId}`);
      if (!muteRole) muteRole = null;
      if (!muteRole) continue;
      if (Date.now() > time) {
        member.removeRole(muteRole);
        delete client.mutes[i];
        fs.writeFile('./mutes.json', JSON.stringify(client.mutes), err => {
            if (err) throw err;
            console.log(`Unmute: ${member.user.tag} | ${time}`);
        });
      }
    }
  }, 1000);

  setInterval(async () => {
    for (const i in client.tempBans) {
      const time = client.tempBans[i].time;
      const guildId = client.tempBans[i].guild;
      const guild = client.guilds.get(guildId); 
      const member = await client.fetchUser(i);
      if (guild.member(member)) continue;
      if (Date.now() > time) {
        member.unban();
        delete client.tempBans[i];
        fs.writeFile('./tempbans.json', JSON.stringify(client.tempBans), err => {
            if (err) throw err;
            console.log(`Unban: ${member.user.tag} | ${time}`);
        });
      }
    }
  }, 1000);
}