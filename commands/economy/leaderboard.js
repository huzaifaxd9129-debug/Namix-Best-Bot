const {
  loadData
} = require("../../utils/economy");

module.exports = {
  name: "leaderboard",
  aliases: ["lb"],

  async execute(message) {

    const data = loadData();

    const top =
      Object.entries(data)
      .sort(
        (a, b) =>
        (b[1].cash + b[1].bank)
        -
        (a[1].cash + a[1].bank)
      )
      .slice(0, 10);

    let text = "🏆 Nexora Eco Leaderboard\n\n";

    for (let i = 0; i < top.length; i++) {

      const user =
        await message.client.users.fetch(
          top[i][0]
        );

      text += `${i + 1}. ${user.username}\n`;

    }

    message.channel.send(text);

  }
};
