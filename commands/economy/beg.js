const {
  loadData,
  saveData,
  getUser
} = require("../../utils/economy");

module.exports = {
  name: "beg",

  async execute(message) {

    const data = loadData();

    const user = getUser(data, message.author.id);

    const amount =
      Math.floor(Math.random() * 200)
      + 50;

    user.cash += amount;

    saveData(data);

    message.channel.send(
      `🙏 Someone gave you ${amount} coins`
    );

  }
};
