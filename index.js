require("dotenv").config();
const fs = require("fs");
const {
  Client,
  GatewayIntentBits,
  Partials,
  Collection,
  REST,
  Routes
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

// ======================================================
// COMMAND HANDLER
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

console.log("🚀 Commands loaded!");

// ======================================================
// EVENT HANDLER (messageCreate is handled HERE)
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
