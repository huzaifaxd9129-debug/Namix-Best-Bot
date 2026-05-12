const setup = require("../commands/setup");

module.exports = async (member) => {

  if (setup.memberLeave) {
    setup.memberLeave(member);
  }

  console.log(`📤 Left: ${member.user.tag}`);
};
