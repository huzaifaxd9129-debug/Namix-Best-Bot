const {
  loadData,
  getUser
} = require("../../utils/economy");

module.exports = {
  name: "inventory",
  aliases: ["inv"],

  async execute(message) {

    const data = loadData();

    const user = getUser(
      data,
      message.author.id
    );

    if (!user.inventory.length) {
      return message.reply(
        "Inventory empty."
      );
    }

    message.channel.send(
      user.inventory.join(", ")
    );

  }
};
