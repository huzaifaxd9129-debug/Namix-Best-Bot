module.exports = {
  name: "rps",
  description: "Rock Paper Scissors",

  async execute(message, args) {
    const choices = ["rock", "paper", "scissors"];
    const bot = choices[Math.floor(Math.random() * 3)];

    const user = args[0];
    if (!choices.includes(user)) return message.reply("Choose rock, paper, or scissors!");

    let result =
      user === bot ? "Draw" :
      (user === "rock" && bot === "scissors") ||
      (user === "paper" && bot === "rock") ||
      (user === "scissors" && bot === "paper")
        ? "You Win!" : "You Lose!";

    message.reply(`You: ${user}\nBot: ${bot}\nResult: ${result}`);
  }
};
