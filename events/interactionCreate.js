const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField,
  ChannelType
} = require("discord.js");

const fs = require("fs");

const setup = require("../commands/setup");

// ==================================================
// TICKET DATABASE
// ==================================================

const ticketFile = "./data/tickets.json";

function loadTickets() {

  if (!fs.existsSync("./data")) {
    fs.mkdirSync("./data");
  }

  if (!fs.existsSync(ticketFile)) {
    fs.writeFileSync(ticketFile, "{}");
  }

  return JSON.parse(
    fs.readFileSync(ticketFile, "utf8")
  );
}

// ==================================================
// EVENT
// ==================================================

module.exports = async (interaction, client) => {

  // ==================================================
  // SLASH COMMANDS
  // ==================================================

  if (interaction.isChatInputCommand()) {

    const command =
      client.slashCommands.get(
        interaction.commandName
      );

    if (!command) {

      return interaction.reply({

        content: "❌ Unknown command.",

        ephemeral: true

      });

    }

    try {

      await command.execute(interaction);

    } catch (err) {

      console.log(
        `❌ Slash Command Error [${interaction.commandName}]`,
        err
      );

      const msg = {

        content:
          "❌ Error while executing command.",

        ephemeral: true

      };

      if (
        interaction.replied ||
        interaction.deferred
      ) {

        await interaction.followUp(msg)
          .catch(() => {});

      } else {

        await interaction.reply(msg)
          .catch(() => {});

      }
    }

    return;
  }

  // ==================================================
  // BUTTONS
  // ==================================================

  if (interaction.isButton()) {

    // ================= VERIFY =================

    if (setup.verifyButton) {
      setup.verifyButton(interaction);
    }

    // ================= STAFF APPLY =================

    if (setup.staffApplyButton) {
      setup.staffApplyButton(interaction);
    }

    // ==================================================
    // CLOSE TICKET BUTTON
    // ==================================================

    if (
      interaction.customId ===
      "close_ticket"
    ) {

      const ownerId =
        interaction.channel.topic;

      if (!ownerId) {

        return interaction.reply({

          content:
            "❌ Ticket owner missing.",

          ephemeral: true

        });

      }

      await interaction.channel.permissionOverwrites.edit(

        ownerId,

        {
          SendMessages: false
        }

      );

      return interaction.reply({

        content:
          "🔒 Ticket closed."

      });
    }

    // ==================================================
    // CLAIM TICKET BUTTON
    // ==================================================

    if (
      interaction.customId ===
      "claim_ticket"
    ) {

      return interaction.reply({

        content:
          `🎟 Ticket claimed by ${interaction.user}`

      });
    }
  }

  // ==================================================
  // MODALS
  // ==================================================

  if (interaction.isModalSubmit()) {

    // ================= STAFF APPLY MODAL =================

    if (
      interaction.customId ===
      "staff_apply_modal"
    ) {

      if (setup.staffApplyModal) {

        setup.staffApplyModal(
          interaction,
          client
        );

      }
    }
  }

  // ==================================================
  // DROPDOWN TICKET SYSTEM
  // ==================================================

  if (interaction.isStringSelectMenu()) {

    // ==================================================
    // TICKET DROPDOWN
    // ==================================================

    if (
      interaction.customId ===
      "ticket_dropdown"
    ) {

      const data =
        loadTickets();

      const config =
        data[interaction.guild.id];

      if (!config) {

        return interaction.reply({

          content:
            "❌ Ticket system not setup.",

          ephemeral: true

        });

      }

      const category =
        interaction.values[0];

      // ==================================================
      // DUPLICATE CHECK
      // ==================================================

      const existing =
        interaction.guild.channels.cache.find(

          c =>
            c.topic ===
            interaction.user.id

        );

      if (existing) {

        return interaction.reply({

          content:
            `❌ You already have a ticket: ${existing}`,

          ephemeral: true

        });

      }

      // ==================================================
      // CREATE CHANNEL
      // ==================================================

      const channel =
        await interaction.guild.channels.create({

          name:
            `${category}-${interaction.user.username}`,

          type:
            ChannelType.GuildText,

          topic:
            interaction.user.id,

          permissionOverwrites: [

            {
              id:
                interaction.guild.id,

              deny: [
                PermissionsBitField.Flags.ViewChannel
              ]
            },

            {
              id:
                interaction.user.id,

              allow: [

                PermissionsBitField.Flags.ViewChannel,

                PermissionsBitField.Flags.SendMessages,

                PermissionsBitField.Flags.ReadMessageHistory

              ]
            },

            {
              id:
                config.supportRole,

              allow: [

                PermissionsBitField.Flags.ViewChannel,

                PermissionsBitField.Flags.SendMessages,

                PermissionsBitField.Flags.ReadMessageHistory

              ]
            }

          ]

        });

      // ==================================================
      // EMBED
      // ==================================================

      const embed =
        new EmbedBuilder()

          .setColor("Blue")

          .setTitle("🎫 Ticket Created")

          .setDescription(
`
Welcome ${interaction.user}

📂 Category:
${category}

Support will help you soon.
`
          );

      // ==================================================
      // BUTTONS
      // ==================================================

      const row =
        new ActionRowBuilder()

          .addComponents(

            new ButtonBuilder()

              .setCustomId(
                "close_ticket"
              )

              .setLabel("Close")

              .setStyle(
                ButtonStyle.Danger
              ),

            new ButtonBuilder()

              .setCustomId(
                "claim_ticket"
              )

              .setLabel("Claim")

              .setStyle(
                ButtonStyle.Primary
              )

          );

      // ==================================================
      // SEND MESSAGE
      // ==================================================

      await channel.send({

        content:
          `${interaction.user} <@&${config.supportRole}>`,

        embeds: [embed],

        components: [row]

      });

      // ==================================================
      // REPLY
      // ==================================================

      return interaction.reply({

        content:
          `✅ Ticket created: ${channel}`,

        ephemeral: true

      });

    }
  }
};
