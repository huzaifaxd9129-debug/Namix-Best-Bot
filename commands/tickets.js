const {
  EmbedBuilder,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  PermissionsBitField
} = require("discord.js");

module.exports = {
  name: "ticket",
  aliases: ["tickets"],

  async execute(message, args) {

    const cmd = args[0];

    // ==================================================
    // HELP
    // ==================================================

    if (!cmd || cmd === "help") {
      return message.channel.send(`
🎫 TICKET COMMANDS

!ticket close
!ticket claim
!ticket rename <name>
!ticket add @user
!ticket remove @user
      `);
    }

    // ==================================================
    // CLOSE
    // ==================================================

    if (cmd === "close") {

      if (
        !message.member.permissions.has(
          PermissionsBitField.Flags.ManageChannels
        )
      ) {
        return message.reply("❌ No permission.");
      }

      const embed = new EmbedBuilder()
        .setTitle("🔒 Ticket Closing")
        .setDescription(`
This ticket will close in 5 seconds.
        `)
        .setColor("Red");

      await message.channel.send({
        embeds: [embed]
      });

      setTimeout(async () => {
        await message.channel.delete().catch(() => {});
      }, 5000);
    }

    // ==================================================
    // CLAIM
    // ==================================================

    if (cmd === "claim") {

      if (
        !message.member.permissions.has(
          PermissionsBitField.Flags.ManageChannels
        )
      ) {
        return message.reply("❌ No permission.");
      }

      const embed = new EmbedBuilder()
        .setTitle("🎟️ Ticket Claimed")
        .setDescription(`
Claimed by ${message.author}
        `)
        .setColor("Blue");

      return message.channel.send({
        embeds: [embed]
      });
    }

    // ==================================================
    // RENAME
    // ==================================================

    if (cmd === "rename") {

      if (
        !message.member.permissions.has(
          PermissionsBitField.Flags.ManageChannels
        )
      ) {
        return message.reply("❌ No permission.");
      }

      const name = args.slice(1).join("-");

      if (!name) {
        return message.reply("Provide a name.");
      }

      await message.channel.setName(name);

      return message.channel.send(
        `✅ Ticket renamed to ${name}`
      );
    }

    // ==================================================
    // ADD USER
    // ==================================================

    if (cmd === "add") {

      if (
        !message.member.permissions.has(
          PermissionsBitField.Flags.ManageChannels
        )
      ) {
        return message.reply("❌ No permission.");
      }

      const member =
        message.mentions.members.first();

      if (!member) {
        return message.reply("Mention a user.");
      }

      await message.channel.permissionOverwrites.edit(
        member.id,
        {
          ViewChannel: true,
          SendMessages: true
        }
      );

      return message.channel.send(
        `✅ Added ${member}`
      );
    }

    // ==================================================
    // REMOVE USER
    // ==================================================

    if (cmd === "remove") {

      if (
        !message.member.permissions.has(
          PermissionsBitField.Flags.ManageChannels
        )
      ) {
        return message.reply("❌ No permission.");
      }

      const member =
        message.mentions.members.first();

      if (!member) {
        return message.reply("Mention a user.");
      }

      await message.channel.permissionOverwrites.delete(
        member.id
      );

      return message.channel.send(
        `✅ Removed ${member}`
      );
    }

  }
};

// ======================================================
// BUTTON SYSTEM
// ======================================================

module.exports.ticketButtons = async (interaction) => {

  // ==================================================
  // CREATE TICKET
  // ==================================================

  if (
    interaction.customId === "ticket_support" ||
    interaction.customId === "ticket_purchase" ||
    interaction.customId === "ticket_report" ||
    interaction.customId === "ticket_apply"
  ) {

    const already = interaction.guild.channels.cache.find(
      c =>
        c.name ===
        `ticket-${interaction.user.id}`
    );

    if (already) {
      return interaction.reply({
        content: "❌ You already have a ticket.",
        ephemeral: true
      });
    }

    let type = "support";

    if (interaction.customId === "ticket_purchase")
      type = "purchase";

    if (interaction.customId === "ticket_report")
      type = "report";

    if (interaction.customId === "ticket_apply")
      type = "apply";

    const channel = await interaction.guild.channels.create({
      name: `ticket-${interaction.user.username}`,
      permissionOverwrites: [
        {
          id: interaction.guild.id,
          deny: ["ViewChannel"]
        },
        {
          id: interaction.user.id,
          allow: [
            "ViewChannel",
            "SendMessages",
            "ReadMessageHistory"
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

  // ==================================================
  // CLOSE BUTTON
  // ==================================================

  if (interaction.customId === "close_ticket") {

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ManageChannels
      )
    ) {
      return interaction.reply({
        content: "❌ No permission.",
        ephemeral: true
      });
    }

    await interaction.reply({
      content: "🔒 Closing ticket in 5 seconds..."
    });

    setTimeout(async () => {
      await interaction.channel.delete().catch(() => {});
    }, 5000);
  }

  // ==================================================
  // CLAIM BUTTON
  // ==================================================

  if (interaction.customId === "claim_ticket") {

    if (
      !interaction.member.permissions.has(
        PermissionsBitField.Flags.ManageChannels
      )
    ) {
      return interaction.reply({
        content: "❌ No permission.",
        ephemeral: true
      });
    }

    const embed = new EmbedBuilder()
      .setTitle("🎟️ Ticket Claimed")
      .setDescription(`
Claimed by ${interaction.user}
      `)
      .setColor("Green");

    return interaction.reply({
      embeds: [embed]
    });
  }

};
