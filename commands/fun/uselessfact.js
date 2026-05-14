const facts = [
  "Bananas are berries.",
  "Octopuses have three hearts.",
  "Honey never spoils.",
  "A day on Venus is longer than a year."
];

module.exports = {
  name: "uselessfact",
  description: "Random useless fact",

  async execute(message) {
    const fact = facts[Math.floor(Math.random() * facts.length)];
    message.reply(`🧾 ${fact}`);
  }
};
