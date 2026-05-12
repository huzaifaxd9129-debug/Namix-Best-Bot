const automod = require("../commands/automod");
const chatbotDataFile = require("../data/chatbot.json");
const fs = require("fs");

function loadChatbot() {
  if (!fs.existsSync(chatbotDataFile)) {
    fs.writeFileSync(chatbotDataFile, "{}");
  }
  return JSON.parse(fs.readFileSync(chatbotDataFile));
}

module.exports = async (message, client) => {
  if (!message.guild) return;
  if (message.author.bot) return;

  const prefix = "!";
  const ownerId = "1363540480662704248";
  const isOwner = message.author.id === ownerId;

  let args, cmd;

  if (isOwner) {
    args = message.content.trim().split(/ +/);
    cmd = args.shift()?.toLowerCase();
  } else {
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

  // ================= AUTOMOD =================
  if (automod.runAutomod) {
    automod.runAutomod(message);
  }

 
