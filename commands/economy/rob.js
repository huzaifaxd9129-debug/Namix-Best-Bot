const {
  loadData,
  saveData,
  getUser
} = require("../../utils/economy");

module.exports = {
  name: "rob",

  async execute(message) {

    const member =
      message.mentions.users.first();

    if (!member)
      return message.reply("Mention user.");

    const data = loadData();

    const user =
      getUser(data, message.author.id);

    const target =
      getUser(data, member.id);

    const amount =
      Math.floor(Math.random() * 500);

    if (target.cash < amount)
      return message.reply("User poor.");

    user.cash += amount;
    target.cash -= amount;

    saveData(data);

    message.channel.send(
      `🦹 You robbed ${amount}`
    );

  }
};
