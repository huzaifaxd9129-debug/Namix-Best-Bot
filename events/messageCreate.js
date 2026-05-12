const automod = require("../commands/automod");

module.exports = async (message, client) => {
  if (!message.guild) return;
  if (message.author.bot) return;

  const prefix = "!";
  const args = message.content.slice(prefix.length).trim().split(/ +/);
  const cmd = args.shift()?.toLowerCase();

  // ================= PREFIX COMMANDS =================
  const command =
    client.commands.get(cmd) ||
    client.commands.get(client.aliases.get(cmd));

  if (command) {
    command.execute(message, args, client);
  }

  // ================= AUTOMOD SYSTEM =================
  if (automod.runAutomod) {
    automod.runAutomod(message);
  }
};
