const { SlashCommandBuilder } = require("discord.js");

module.exports = [
  {
    data: new SlashCommandBuilder()
      .setName("ping")
      .setDescription("Check bot latency"),

    async execute(interaction) {
      await interaction.reply("🏓 Pong!");
    }
  },

  {
    data: new SlashCommandBuilder()
      .setName("hello")
      .setDescription("Say hello"),

    async execute(interaction) {
      await interaction.reply("👋 Hello!");
    }
  }
];
