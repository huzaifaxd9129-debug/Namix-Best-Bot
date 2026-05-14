const { isPremiumUser, isPremiumGuild } = require("./premium");

module.exports = function (interaction) {
  const userPremium = isPremiumUser(interaction.user.id);
  const guildPremium = interaction.guild ? isPremiumGuild(interaction.guild.id) : false;

  return userPremium || guildPremium;
};
