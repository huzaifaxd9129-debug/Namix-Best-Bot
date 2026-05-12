const setup = require("../commands/setup");

module.exports = async (member) => {
  // welcome + autorole system
  if (setup.memberJoin) {
    setup.memberJoin(member);
  }

  console.log(`📥 Joined: ${member.user.tag}`);
};
