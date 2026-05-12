require("dotenv").config();
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

// ================= LOAD COMMANDS =================

const commandFolders = fs.readdirSync("./commands");

for (const folder of commandFolders) {
  const commandFiles = fs
    .readdirSync(`./commands/${folder}`)
    .filter(f => f.endsWith(".js"));

  for (const file of commandFiles) {
    const command = require(`./commands/${folder}/${file}`);

    if (command.name) {
      client.commands.set(command.name, command);
    }

    if (command.aliases && Array.isArray(command.aliases)) {
      command.aliases.forEach(alias =>
        client.aliases.set(alias, command.name)
      );
    }
  }
}

console.log("🚀 All commands loaded successfully!");

// ================= LOAD EVENTS =================

const eventFiles = fs.readdirSync("./events");

for (const file of eventFiles) {
  const event = require(`./events/${file}`);
  const eventName = file.split(".")[0];

  client.on(eventName, (...args) =>
    event(...args, client)
  );
}

console.log("📡 All events loaded successfully!");

// ================= MESSAGE HANDLER =================

client.on("messageCreate", async (message) => {
  if (!message.guild) return;
  if (message.author.bot) return;

  const prefix = config.prefix;

  if (!message.content.startsWith(prefix)) return;

  const args = message.content
    .slice(prefix.length)
    .trim()
    .split(/ +/);

  const cmd = args.shift().toLowerCase();

  const command =
    client.commands.get(cmd) ||
    client.commands.get(client.aliases.get(cmd));

  if (!command) return;

  try {
    command.execute(message, args, client);
  } catch (err) {
    console.error(err);
    message.reply("❌ Error executing command.");
  }
});

// ================= ERROR HANDLING =================

process.on("unhandledRejection", (err) => {
  console.log("⚠️ Unhandled Rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.log("⚠️ Uncaught Exception:", err);
});

// ================= LOGIN =================

client.login(config.token);
