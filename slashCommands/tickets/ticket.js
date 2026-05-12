const {
  SlashCommandBuilder,
  EmbedBuilder,
  PermissionsBitField
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ticket")
    .setDescription("Ticket management commands")
    .addSubcommand(sub =>
      sub
        .setName("help")
        .setDescription("Show all ticket commands")
    )
    .addSubcommand(sub =>
      sub
        .setName("close")
        .setDescription("Close the current ticket channel")
    )
    .addSubcommand(sub =>
      sub
        .setName("claim")
        .setDescription("Claim the current ticket")
    )
    .addSubcommand(sub =>
      sub
        .setName("rename")
        .setDescription("Rename the current ticket channel")
        .addStringOption(opt =>
          opt
            .setName("name")
            .setDescription("New name for the ticket channel")
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("add")
        .setDescription("Add a user to the current ticket")
        .addUserOption(opt =>
          opt
            .setName("user")
            .setDescription("User to add")
            .setRequired(true)
        )
    )
    .addSubcommand(sub =>
      sub
        .setName("remove")
        .setDescription("Remove a user from the current ticket")
        .addUserOption(opt =>
          opt
            .setName("user")
            .setDescription("User to remove")
            .setRequired(true)
        )
    ),

  async execute(interaction) {

    const sub = interaction.options.getSubcommand();

    // ==================================================
    // HELP
    // ==================================================

    if (sub === "help") {
      return interaction.reply({
        content: `
🎫 **TICKET COMMANDS**

\`/ticket close\`
\`/ticket claim\`
\`/ticket rename <name>\`
\`/ticket add <user>\`
\`/ticket remove <user>\`
        `.trim(),
        ephemeral: true
      });
    }

    // ==================================================
    // CLOSE
    // ==================================================

    if (sub === "close") {

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
        .setTitle("🔒 Ticket Closing")
        .setDescription("This ticket will close in 5 seconds.")
        .setColor("Red");

      await interaction.reply({ embeds: [embed] });

      setTimeout(async () => {
        await interaction.channel.delete().catch(() => {});
      }, 5000);
    }

    // ==================================================
    // CLAIM
    // ==================================================

    if (sub === "claim") {

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
        .setDescription(`Claimed by ${interaction.user}`)
        .setColor("Blue");

      return interaction.reply({ embeds: [embed] });
    }

    // ==================================================
    // RENAME
    // ==================================================

    if (sub === "rename") {

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

      const name = interaction.options
        .getString("name")
        .replace(/ /g, "-");

      await interaction.channel.setName(name);

      return interaction.reply({
        content: `✅ Ticket renamed to **${name}**`
      });
    }

    // ==================================================
    // ADD USER
    // ==================================================

    if (sub === "add") {

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

      const member = interaction.options.getMember("user");

      await interaction.channel.permissionOverwrites.edit(
        member.id,
        {
          ViewChannel: true,
          SendMessages: true
        }
      );

      return interaction.reply({
        content: `✅ Added ${member}`
      });
    }

    // ==================================================
    // REMOVE USER
    // ==================================================

    if (sub === "remove") {

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

      const member = interaction.options.getMember("user");

      await interaction.channel.permissionOverwrites.delete(
        member.id
      );

      return interaction.reply({
        content: `✅ Removed ${member}`
      });
    }
  }
};
