module.exports = {

  name: "tclose",
  aliases: ["ticketclose"],

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
        SendMessages: false
      }
    );

    message.reply(
      "🔒 Ticket closed."
    );
  }
};
