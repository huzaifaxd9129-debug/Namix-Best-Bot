const {
  EmbedBuilder,
  PermissionsBitField
} = require("discord.js");

module.exports = {
  name: "embed",
  description: "Send custom embeds",

  async execute(message, args) {

    // Optional: Admin only
    if (
      !message.member.permissions.has(
        PermissionsBitField.Flags.ManageMessages
      )
    ) {
      return message.reply("❌ You need Manage Messages permission.");
    }

    // Usage:
    // !embed #ff0000 Hello world
    // !embed red Welcome to server

    const color = args[0];
    const text = args.slice(1).join(" ");

    if (!color || !text) {
      return message.reply(
        "❌ Usage: `!embed <color> <text>`\nExample: `!embed #ff0000 Hello`"
      );
    }

    const embed = new EmbedBuilder()
      .setColor(color)
      .setDescription(text)
      .setTimestamp();

    await message.channel.send({
      embeds: [embed]
    });

    message.delete().catch(() => {});
  }
};
