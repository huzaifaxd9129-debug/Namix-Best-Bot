module.exports = {
  name: "emojify",
  description: "Convert text to emoji",

  async execute(message, args) {
    if (!args.length) return message.reply("Give text!");

    const map = {
      a: "🅰️", b: "🅱️", c: "🌜", d: "↩️", e: "📧",
      f: "🎏", g: "🌀", h: "♓", i: "ℹ️", j: "🎷",
      k: "🎋", l: "👢", m: "〽️", n: "🎶", o: "⭕",
      p: "🅿️", q: "🍳", r: "🌱", s: "💲", t: "🌴",
      u: "⛎", v: "✔️", w: "〰️", x: "❌", y: "🍸", z: "💤"
    };

    const text = args.join(" ").toLowerCase()
      .split("")
      .map(c => map[c] || c)
      .join("");

    message.reply(text);
  }
};
