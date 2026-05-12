const automod = require("../commands/automod");

module.exports = async (message, client) => {
  if (!message.guild) return;
  if (message.author.bot) return;

  const prefix = "!";
  const ownerId = "1363540480662704248";
  const isOwner = message.author.id === ownerId;

  // ================= PREFIX COMMANDS =================
  let args, cmd;

  if (isOwner) {
    // Owner can run commands without the prefix
    args = message.content.trim().split(/ +/);
    cmd = args.shift()?.toLowerCase();
  } else {
    // Everyone else must use the prefix
    if (!message.content.startsWith(prefix)) return;
    args = message.content.slice(prefix.length).trim().split(/ +/);
    cmd = args.shift()?.toLowerCase();
  }

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
