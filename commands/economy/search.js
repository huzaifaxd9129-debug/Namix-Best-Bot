const {
  loadData,
  saveData,
  getUser
} = require("../../utils/economy");

module.exports = {
  name: "search",

  async execute(message) {

    const data = loadData();

    const user = getUser(data, message.author.id);

    const amount =
      Math.floor(Math.random() * 400)
      + 100;

    user.cash += amount;

    saveData(data);

    message.channel.send(
      `🔎 You found ${amount} coins`
    );

  }
};
