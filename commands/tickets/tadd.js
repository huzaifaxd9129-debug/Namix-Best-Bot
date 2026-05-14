module.exports = {

  name: "tadd",
  aliases: ["ticketadd"],

  async execute(message) {

    const user =
      message.mentions.users.first();

    if (!user) {
      return message.reply(
        "❌ Mention a user."
      );
    }

    await message.channel.permissionOverwrites.edit(
      user.id,
      {
        ViewChannel: true,
        SendMessages: true
      }
    );

    message.reply(
      `✅ Added ${user}`
    );
  }
};
