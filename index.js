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
// SLASH COMMAND HANDLER (ADDED)
// ======================================================

const slashCommands = [];
const slashPath = "./slashCommands.js"; // your single file

if (fs.existsSync(slashPath)) {
  const cmds = require(slashPath);

  for (const cmd of cmds) {
    client.slashCommands.set(cmd.data.name, cmd);
    slashCommands.push(cmd.data.toJSON());
  }

  console.log("⚡ Slash commands loaded!");
}

// ======================================================
// SLASH COMMAND REGISTRATION (AUTO DEPLOY)
// ======================================================

const rest = new REST({ version: "10" }).setToken(config.token);

const CLIENT_ID = config.clientId;
const GUILD_ID = config.guildId; // recommended for testing

(async () => {
  try {
    if (!CLIENT_ID || !GUILD_ID) {
      console.log("⚠️ Missing CLIENT_ID or GUILD_ID in config");
      return;
    }

    console.log("🔄 Deploying slash commands...");

    await rest.put(
      Routes.applicationGuildCommands(CLIENT_ID, GUILD_ID),
      { body: slashCommands }
    );

    console.log("✅ Slash commands deployed!");
  } catch (err) {
    console.error("❌ Slash deploy error:", err);
  }
})();

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
