module.exports = {
  name: "setecochannel",

  async execute(message, args) {

    if (!message.member.permissions.has("Administrator")) {
      return message.reply("❌ Admin only");
    }

    const channel =
      message.mentions.channels.first();

    if (!channel) {
      return message.reply("Mention a channel");
    }

    message.client.ecoChannels.set(
      message.guild.id,
      channel.id
    );

    message.channel.send(
      `✅ Economy channel set to ${channel}`
    );

  }
};
