const fs = require("fs");
const { EmbedBuilder } = require("discord.js");

module.exports = async (member) => {

  const file = "./data/welcome.json";

  if (!fs.existsSync(file)) return;

  const data = JSON.parse(fs.readFileSync(file, "utf8"));

  const setup = data[member.guild.id];

  if (!setup || !setup.enabled) return;

  const channel = member.guild.channels.cache.get(setup.channelId);

  if (!channel) return;

  const msg = setup.message
    .replace("{user}", `<@${member.id}>`)
    .replace("{server}", member.guild.name);

  channel.send({
    content: msg
  });

};
