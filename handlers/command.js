const { readdirSync } = require("fs");

module.exports = (client) => {
  const load = folder => {
    const commands = readdirSync(`./commands/${folder}/`).filter(d => d.endsWith('.js'));
    for (let file of commands) {
      const pull = require(`../commands/${folder}/${file}`);
      client.commands.set(pull.name, pull);
      if (pull.aliases) pull.aliases.forEach(a => client.aliases.set(a, pull.name));
      console.log(`${file} loaded!`);
    }
  }
  ["action", "configuration", "currency", "developer", "info", "moderation", "random", "verification"].forEach(x => load(x));
}