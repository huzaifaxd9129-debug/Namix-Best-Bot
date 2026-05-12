require("dotenv").config();
const { REST, Routes } = require("discord.js");

const config = require("./config");
const slashCommands = require("./slashCommands");

// Convert commands into Discord format
const commands = slashCommands.map(cmd => cmd.data.toJSON());

const rest = new REST({ version: "10" }).setToken(config.token);

(async () => {
  try {
    console.log("🔄 Deploying slash commands...");

    await rest.put(
      Routes.applicationGuildCommands(config.clientId, config.guildId),
      { body: commands }
    );

    console.log("✅ Slash commands deployed successfully!");
  } catch (error) {
    console.error("❌ Error deploying commands:", error);
  }
})();
