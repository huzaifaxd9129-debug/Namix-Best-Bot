const setup = require("../commands/setup");
const tickets = require("../commands/tickets");

module.exports = async (interaction, client) => {

  if (!interaction.isButton()) return;

  // ================= VERIFY BUTTON =================
  if (setup.verifyButton) {
    setup.verifyButton(interaction);
  }

  // ================= TICKET BUTTONS =================
  if (tickets.ticketButtons) {
    tickets.ticketButtons(interaction);
  }
};
