module.exports = {
  name: "roles",

  async execute(message) {
    const roles = message.guild.roles.cache.map(r => r.name).slice(0, 20).join(", ");
    message.reply(`Roles: ${roles}`);
  }
};
