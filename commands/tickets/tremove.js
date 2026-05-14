module.exports = {

  name: "tremove",
  aliases: ["ticketremove"],

  async execute(message) {

    const user =
      message.mentions.users.first();

    if (!user) {
      return message.reply(
        "❌ Mention a user."
      );
    }

    await message.channel.permissionOverwrites.delete(
      user.id
    );

    message.reply(
      `❌ Removed ${user}`
    );
  }
};
