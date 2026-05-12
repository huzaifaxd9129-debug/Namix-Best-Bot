const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField
} = require("discord.js");

const setup = require("../commands/setup");
const tickets = require("../commands/tickets");

module.exports = async (interaction, client) => {

  // ================= BUTTON INTERACTIONS =================

  if (interaction.isButton()) {

    // ================= VERIFY BUTTON =================
    if (setup.verifyButton) {
      setup.verifyButton(interaction);
    }

    // ================= TICKET BUTTONS =================
    if (tickets.ticketButtons) {
      tickets.ticketButtons(interaction);
    }
  }

  // ================= DROPDOWN INTERACTIONS =================

  if (interaction.isStringSelectMenu()) {

    // ================= TICKET MENU =================

    if (interaction.customId === "ticket_menu") {

      const type = interaction.values[0];

      const already = interaction.guild.channels.cache.find(
        c => c.name === `ticket-${interaction.user.username}`
      );

      if (already) {
        return interaction.reply({
          content: "❌ You already have a ticket.",
          ephemeral: true
        });
      }

      const channel = await interaction.guild.channels.create({
        name: `ticket-${interaction.user.username}`,
        permissionOverwrites: [
          {
            id: interaction.guild.id,
            deny: [PermissionsBitField.Flags.ViewChannel]
          },
          {
            id: interaction.user.id,
            allow: [
              PermissionsBitField.Flags.ViewChannel,
              PermissionsBitField.Flags.SendMessages,
              PermissionsBitField.Flags.ReadMessageHistory
            ]
          }
        ]
      });

      const embed = new EmbedBuilder()
        .setTitle("🎫 Ticket Created")
        .setDescription(`
Welcome ${interaction.user}

📂 Type: ${type}

Support will help you shortly.
        `)
        .setColor("Blue");

      const row = new ActionRowBuilder()
        .addComponents(
          new ButtonBuilder()
            .setCustomId("close_ticket")
            .setLabel("Close")
            .setStyle(ButtonStyle.Danger),

          new ButtonBuilder()
            .setCustomId("claim_ticket")
            .setLabel("Claim")
            .setStyle(ButtonStyle.Primary)
        );

      await channel.send({
        content: `${interaction.user}`,
        embeds: [embed],
        components: [row]
      });

      return interaction.reply({
        content: `✅ Ticket created: ${channel}`,
        ephemeral: true
      });
    }
  }
};
