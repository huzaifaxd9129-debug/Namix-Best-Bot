const {
  PermissionsBitField
} = require("discord.js");

module.exports = {
  name: "say",
  description: "Make bot say something",

  async execute(message, args) {

    // Optional: Admin only
    if (
      !message.member.permissions.has(
        PermissionsBitField.Flags.ManageMessages
      )
    ) {
      return message.reply("❌ You need Manage Messages permission.");
    }

    const text = args.join(" ");

    if (!text) {
      return message.reply(
        "❌ Usage: `!say <text>`"
      );
    }

    await message.channel.send(text);

    message.delete().catch(() => {});
  }
};
