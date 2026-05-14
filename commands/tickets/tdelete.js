module.exports = {

  name: "tdelete",
  aliases: ["ticketdelete"],

  async execute(message) {

    if (
      !message.channel.name.includes("-")
    ) {
      return message.reply(
        "❌ This is not a ticket."
      );
    }

    await message.reply(
      "🗑 Ticket deleting in 5 seconds..."
    );

    setTimeout(() => {

      message.channel.delete();

    }, 5000);
  }
};
