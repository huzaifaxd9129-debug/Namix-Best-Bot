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
// SLASH COMMAND HANDLER
// ======================================================

const slashPath = "./slashCommands";

function loadSlashCommands(dir) {
  const entries = fs.readdirSync(dir);

  for (const entry of entries) {
    const fullPath = `${dir}/${entry}`;

    if (fs.lstatSync(fullPath).isDirectory()) {
      loadSlashCommands(fullPath);
    } else if (entry.endsWith(".js")) {
      const command = require(fullPath);

      if (command.data && command.execute) {
        client.slashCommands.set(command.data.name, command);
      }
    }
  }
}

loadSlashCommands(slashPath);

console.log(`⚡ Slash commands loaded: ${[...client.slashCommands.keys()].join(", ")}`);

// ======================================================
// DEPLOY SLASH COMMANDS VIA REST
// ======================================================

async function deploySlashCommands() {
  if (!config.token) return;

  const rest = new REST({ version: "10" }).setToken(config.token);
  const body = [...client.slashCommands.values()].map(cmd => cmd.data.toJSON());

  try {
    console.log("🔄 Deploying slash commands...");

    await rest.put(
      Routes.applicationCommands(config.clientId || process.env.CLIENT_ID),
      { body }
    );

    console.log("✅ Slash commands deployed globally!");
  } catch (err) {
    console.error("❌ Failed to deploy slash commands:", err);
  }
}

deploySlashCommands();

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
