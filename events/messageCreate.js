const automod = require("../commands/automod");

module.exports = async (message, client) => {

  if (!message.guild) return;
  if (message.author.bot) return;

  // ==================================================
  // PREFIX + OWNER COMMANDS
  // ==================================================

  const prefix = "!";
  const ownerId = "1363540480662704248";

  let args;
  let cmd;

  // OWNER WITHOUT PREFIX
  if (message.author.id === ownerId) {
    args = message.content.trim().split(/ +/);
    cmd = args.shift()?.toLowerCase();
  }

  // NORMAL PREFIX
  else if (message.content.startsWith(prefix)) {
    args = message.content.slice(prefix.length).trim().split(/ +/);
    cmd = args.shift()?.toLowerCase();
  }

  // RUN COMMAND
  if (cmd) {
    const command =
      client.commands.get(cmd) ||
      client.commands.get(client.aliases.get(cmd));

    if (command) {
      command.execute(message, args, client);
    }
  }

  // ==================================================
  // AUTOMOD SYSTEM
  // ==================================================

  if (automod.runAutomod) {
    automod.runAutomod(message);
  }
};
