module.exports = {

  name: "trename",
  aliases: ["ticketrename"],

  async execute(message, args) {

    const name =
      args.join("-");

    if (!name) {
      return message.reply(
        "❌ Provide new name."
      );
    }

    await message.channel.setName(
      `ticket-${name}`
    );

    message.reply(
      `✏️ Renamed to ticket-${name}`
    );
  }
};
