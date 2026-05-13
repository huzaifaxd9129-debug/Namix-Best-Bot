const {
  loadData,
  saveData,
  getUser
} = require("../../utils/economy");

module.exports = {
  name: "crime",

  async execute(message) {

    const data = loadData();

    const user = getUser(data, message.author.id);

    const win =
      Math.random() < 0.5;

    if (win) {

      const amount =
        Math.floor(Math.random() * 1000)
        + 200;

      user.cash += amount;

      message.channel.send(
        `🚔 Crime successful! +${amount}`
      );

    } else {

      const loss =
        Math.floor(Math.random() * 500)
        + 100;

      user.cash -= loss;

      message.channel.send(
        `❌ You got caught! -${loss}`
      );

    }

    saveData(data);

  }
};
