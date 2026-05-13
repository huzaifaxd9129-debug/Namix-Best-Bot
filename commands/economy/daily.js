const {
  loadData,
  saveData,
  getUser
} = require("../../utils/economy");

module.exports = {
  name: "daily",

  async execute(message) {

    const data = loadData();

    const user = getUser(
      data,
      message.author.id
    );

    const timeout =
      24 * 60 * 60 * 1000;

    if (
      Date.now() - user.daily
      < timeout
    ) {

      return message.reply(
        "❌ You already claimed daily."
      );

    }

    const amount = 1000;

    user.cash += amount;
    user.daily = Date.now();

    saveData(data);

    message.channel.send(
      `✅ You received ${amount} coins`
    );

  }
};
