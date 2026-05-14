module.exports = {
  name: "inrole",

  async execute(message, args) {
    const role = message.mentions.roles.first();
    if (!role) return message.reply("Mention a role!");

    const members = role.members.map(m => m.user.tag).slice(0, 10).join("\n");
    message.reply(`Users in role:\n${members}`);
  }
};
