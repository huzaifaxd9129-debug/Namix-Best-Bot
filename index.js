require("dotenv").config();
const { GoogleGenerativeAI } = require("@google/generative-ai");
const fs = require("fs");
const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection
} = require("discord.js");

const config = require("./config");

// ================= CLIENT =================

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ],
  partials: [Partials.Channel]
});

// ================= COLLECTIONS =================

client.commands = new Collection();
client.aliases = new Collection();
client.slashCommands = new Collection();
client.ecoChannels = new Map();

// ================= GEMINI AI =================

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

const model = genAI.getGenerativeModel({
  model: "gemini-1.5-flash",
});

// ================= CHATBOT STORAGE =================

const chatbotFile = "./chatbot.json";

function loadChatbot() {
  if (!fs.existsSync(chatbotFile)) fs.writeFileSync(chatbotFile, "{}");
  return JSON.parse(fs.readFileSync(chatbotFile, "utf8"));
}

function saveChatbot(data) {
  fs.writeFileSync(chatbotFile, JSON.stringify(data, null, 2));
}

// ================= SIMPLE MEMORY (OPTIONAL UPGRADE) =================

const memory = new Map();

// ======================================================
// PREFIX COMMAND HANDLER
// ======================================================

const commandPath = "./commands";
const items = fs.readdirSync(commandPath);

for (const item of items) {

  const fullPath = `${commandPath}/${item}`;

  if (item.endsWith(".js")) {

    const command = require(fullPath);

    if (command.name) {
      client.commands.set(command.name, command);
    }

    if (command.aliases) {
      command.aliases.forEach(a =>
        client.aliases.set(a, command.name)
      );
    }

  } else if (fs.lstatSync(fullPath).isDirectory()) {

    const files = fs.readdirSync(fullPath);

    for (const file of files) {

      if (!file.endsWith(".js")) continue;

      const command = require(`${fullPath}/${file}`);

      if (command.name) {
        client.commands.set(command.name, command);
      }

      if (command.aliases) {
        command.aliases.forEach(a =>
          client.aliases.set(a, command.name)
        );
      }
    }
  }
}

console.log("🚀 Prefix commands loaded!");

// ======================================================
// EVENT HANDLER
// ======================================================

const eventFiles = fs.readdirSync("./events");

for (const file of eventFiles) {

  const event = require(`./events/${file}`);
  const eventName = file.split(".")[0];

  client.on(eventName, (...args) =>
    event(...args, client)
  );
}

console.log("📡 Events loaded!");

// ======================================================
// MESSAGE HANDLER (COMMANDS + CHATBOT)
// ======================================================

client.on("messageCreate", async (message) => {

  if (!message.guild) return;
  if (message.author.bot) return;

  const prefix = "!";
  let args;
  let cmd;

  // OWNER COMMANDS (no prefix)
  const ownerId = "1363540480662704248";

  if (message.author.id === ownerId) {
    args = message.content.trim().split(/ +/);
    cmd = args.shift()?.toLowerCase();
  }

  // NORMAL PREFIX COMMANDS
  else if (message.content.startsWith(prefix)) {
    args = message.content.slice(prefix.length).trim().split(/ +/);
    cmd = args.shift()?.toLowerCase();
  }

  // RUN COMMANDS
  if (cmd) {
    const command =
      client.commands.get(cmd) ||
      client.commands.get(client.aliases.get(cmd));

    if (command) {
      return command.execute(message, args, client);
    }
  }

  // ================= CHATBOT SYSTEM =================

  const data = loadChatbot();
  const guildData = data[message.guild.id];

  if (!guildData || !guildData.enabled) return;
  if (message.channel.id !== guildData.channel) return;
  if (message.content.startsWith("!")) return;

  try {
    await message.channel.sendTyping();

    // MEMORY (last 5 messages per user)
    if (!memory.has(message.author.id)) {
      memory.set(message.author.id, []);
    }

    const userMemory = memory.get(message.author.id);

    userMemory.push({
      role: "user",
      parts: [{ text: message.content }]
    });

    if (userMemory.length > 6) userMemory.shift();

    const result = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [
            {
              text: "You are a helpful Discord AI assistant. Keep replies short and clear."
            }
          ]
        },
        ...userMemory
      ]
    });

    const response = await result.response;
    const text = response.text();

    userMemory.push({
      role: "model",
      parts: [{ text }]
    });

    return message.reply(text);

  } catch (err) {
    console.log("Gemini Error:", err);
    return message.reply("❌ AI error occurred.");
  }
});

// ======================================================
// ERROR HANDLING
// ======================================================

process.on("unhandledRejection", (err) => {
  console.log("⚠️ Unhandled Rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.log("⚠️ Uncaught Exception:", err);
});

// ======================================================
// LOGIN
// ======================================================

client.login(config.token);
