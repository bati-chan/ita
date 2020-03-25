const { readdirSync } = require("fs");

module.exports = (client) => {
  const load = dirs => {
    const commands = readdirSync(`./commands/${dirs}/`).filter(d => d.endsWith('.js'));
    for (let file of commands) {
      const pull = require(`../commands/${dirs}/${file}`);
      client.commands.set(pull.name, pull);
      if (pull.aliases) pull.aliases.forEach(a => client.aliases.set(a, pull.name));
      console.log(`${pull.name}.js loaded!`);
    }
  }
  ["Action", "Configuration", "Currency", "Developer", "Info", "Moderation"].forEach(x => load(x));
}