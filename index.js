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

// ======================================================
// COMMAND HANDLER (FIXED - SUPPORT FILES + FOLDERS)
// ======================================================

const commandPath = "./commands";

const items = fs.readdirSync(commandPath);

for (const item of items) {

  const fullPath = `${commandPath}/${item}`;

  // ================= IF FILE =================
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

  }

  // ================= IF FOLDER =================
  else if (fs.lstatSync(fullPath).isDirectory()) {

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

console.log("🚀 Commands loaded!");

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
// MESSAGE HANDLER
// ======================================================

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
