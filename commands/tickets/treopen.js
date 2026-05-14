module.exports = {

  name: "treopen",
  aliases: ["ticketreopen"],

  async execute(message) {

    if (
      !message.channel.name.includes("-")
    ) {
      return message.reply(
        "❌ This is not a ticket."
      );
    }

    const userId =
      message.channel.topic;

    if (!userId) {
      return message.reply(
        "❌ Ticket owner not found."
      );
    }

    await message.channel.permissionOverwrites.edit(
      userId,
      {
        SendMessages: true
      }
    );

    message.reply(
      "🔓 Ticket reopened."
    );
  }
};
