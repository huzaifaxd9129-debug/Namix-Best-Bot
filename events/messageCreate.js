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

  // ==================================================
  // AI CHATBOT
  // ==================================================

(async () => {

module.exports = async (message, client) => {

  if (!message.guild || message.author.bot) return;

  const chatbot = load(chatbotFile);
  const memory = load(memoryFile);

  const guildData = chatbot[message.guild.id];

  if (!guildData || !guildData.enabled) return;
  if (message.channel.id !== guildData.channel) return;
  if (message.content.startsWith("!")) return;

  // cooldown
  if (cooldown.has(message.author.id)) return;
  cooldown.add(message.author.id);
  setTimeout(() => cooldown.delete(message.author.id), 4000);

  try {
    await message.channel.sendTyping();

    if (!memory[message.author.id]) {
      memory[message.author.id] = [];
    }

    const history = memory[message.author.id].map(m => ({
      role: m.role,
      parts: [{ text: m.content }]
    }));

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{
            text: "You are a helpful Discord AI assistant. Keep replies short."
          }]
        },
        ...history,
        {
          role: "user",
          parts: [{ text: message.content }]
        }
      ]
    });

    const response = await result.response;
    const text = response.text();

    memory[message.author.id].push(
      { role: "user", content: message.content },
      { role: "model", content: text }
    );

    memory[message.author.id] = memory[message.author.id].slice(-10);

    save(memoryFile, memory);

    return message.reply(text);

  } catch (err) {
    console.log("AI Error:", err);
    return message.reply("❌ AI error occurred");
  }
};

})();
