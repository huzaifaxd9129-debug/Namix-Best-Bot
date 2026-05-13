const {
  loadData,
  saveData,
  getUser
} = require("../../utils/economy");

module.exports = {
  name: "removemoney",
  aliases: ["rmoney"],

  async execute(message, args) {

    if (
      !message.member.permissions.has("Administrator")
    ) {
      return message.reply(
        "❌ Administrator permission required."
      );
    }

    const member =
      message.mentions.users.first();

    const amount =
      parseInt(args[1]);

    if (!member || isNaN(amount)) {
      return message.reply(
        "Usage: !removemoney @user amount"
      );
    }

    const data = loadData();

    const user =
      getUser(data, member.id);

    user.cash -= amount;

    if (user.cash < 0)
      user.cash = 0;

    saveData(data);

    message.channel.send(
      `❌ Removed ${amount} Nexora Eco from ${member.username}`
    );

  }
};
