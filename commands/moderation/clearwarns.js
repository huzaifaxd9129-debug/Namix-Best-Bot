const fs = require("fs");
const embed = require("../../utils/premiumEmbed");

module.exports = {
  name: "clearwarns",
  execute: (message) => {
    const user = message.mentions.users.first();
    if (!user) return;

    const data = JSON.parse(fs.readFileSync("./warnings.json", "utf8") || "{}");

    delete data[user.id];

    fs.writeFileSync("./warnings.json", JSON.stringify(data, null, 2));

    message.channel.send({
      embeds: [embed("Warnings Cleared", `${user.tag}'s warnings removed 🧹`, message.author)]
    });
  }
};
