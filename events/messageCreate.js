const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const automod = require("../commands/automod");

// ==================================================
// GEMINI AI SETUP
// ==================================================

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// ==================================================
// MEMORY PERSISTENCE
// ==================================================

const memoryFile = "./data/memory.json";

function load(filePath) {
  if (!fs.existsSync(filePath)) fs.writeFileSync(filePath, "{}");
  return JSON.parse(fs.readFileSync(filePath, "utf8"));
}

function save(filePath, data) {
  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
}

// ==================================================
// COOLDOWN
// ==================================================

const cooldown = new Set();

// ==================================================
// EVENT HANDLER
// ==================================================

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
      return command.execute(message, args, client);
    }
  }

  // ==================================================
  // AUTOMOD SYSTEM
  // ==================================================

  if (automod.runAutomod) {
    automod.runAutomod(message);
  }

  // ==================================================
  // AI CHATBOT
  // ==================================================

  const chatbotFile = "./data/chatbot.json";
  const chatbot = load(chatbotFile);
  const guildData = chatbot[message.guild.id];

  if (!guildData || !guildData.enabled) return;
  if (message.channel.id !== guildData.channel) return;
  if (message.content.startsWith("!")) return;

  // Cooldown check (4 seconds)
  if (cooldown.has(message.author.id)) return;
  cooldown.add(message.author.id);
  setTimeout(() => cooldown.delete(message.author.id), 4000);

  try {
    await message.channel.sendTyping();

    const memory = load(memoryFile);

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

