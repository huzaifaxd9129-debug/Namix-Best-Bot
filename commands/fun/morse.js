const morse = {
  a: ".-", b: "-...", c: "-.-.", d: "-..", e: ".",
  f: "..-.", g: "--.", h: "....", i: "..", j: ".---",
  k: "-.-", l: ".-..", m: "--", n: "-.", o: "---",
  p: ".--.", q: "--.-", r: ".-.", s: "...", t: "-",
  u: "..-", v: "...-", w: ".--", x: "-..-", y: "-.--", z: "--..",
  " ": "/"
};

module.exports = {
  name: "morse",
  description: "Text to morse code",

  async execute(message, args) {
    if (!args.length) return message.reply("Give text!");

    const result = args.join(" ").toLowerCase()
      .split("")
      .map(c => morse[c] || "")
      .join(" ");

    message.reply(`📡 ${result}`);
  }
};
