const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder,
  PermissionsBitField
} = require("discord.js");

const fs = require("fs");

const file = "./data/tickets.json";

function load() {

  if (!fs.existsSync("./data")) {
    fs.mkdirSync("./data");
  }

  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, "{}");
  }

  return JSON.parse(
    fs.readFileSync(file, "utf8")
  );
}

function save(data) {

  fs.writeFileSync(
    file,
    JSON.stringify(data, null, 2)
  );
}

module.exports = {

  name: "tsetup",

  async execute(message) {

    if (
      !message.member.permissions.has(
        PermissionsBitField.Flags.Administrator
      )
    ) {
      return message.reply("❌ Admin only.");
    }

    // ================= ASK FUNCTION =================

    const ask = async (question) => {

      const embed = new EmbedBuilder()
        .setColor("Blue")
        .setDescription(question);

      await message.channel.send({
        embeds: [embed]
      });

      const collected =
        await message.channel.awaitMessages({

          filter:
            m => m.author.id === message.author.id,

          max: 1,

          time: 120000

        });

      return collected.first()?.content;
    };

    // ================= TITLE =================

    const title =
      await ask(
        "🎫 Send ticket panel title"
      );

    if (!title) return;

    // ================= DESCRIPTION =================

    const description =
      await ask(
        "📝 Send ticket panel description"
      );

    if (!description) return;

    // ================= CHANNEL =================

    const channelMsg =
      await ask(
        "📡 Mention panel channel"
      );

    const channelMention =
      channelMsg.match(/<#(\d+)>/);

    if (!channelMention) {
      return message.reply(
        "❌ Invalid channel."
      );
    }

    const panelChannel =
      message.guild.channels.cache.get(
        channelMention[1]
      );

    if (!panelChannel) {
      return message.reply(
        "❌ Channel not found."
      );
    }

    // ================= CATEGORY AMOUNT =================

    const amountMsg =
      await ask(
        "📂 How many categories?"
      );

    const amount =
      parseInt(amountMsg);

    if (!amount || amount < 1 || amount > 10) {
      return message.reply(
        "❌ Invalid number."
      );
    }

    // ================= CATEGORY NAMES =================

    const categories = [];

    for (let i = 0; i < amount; i++) {

      const cat =
        await ask(
          `📂 Send category ${i + 1} name`
        );

      if (!cat) return;

      categories.push(cat);
    }

    // ================= SUPPORT ROLE =================

    const roleMsg =
      await ask(
        "👮 Mention support role"
      );

    const roleMention =
      roleMsg.match(/<@&(\d+)>/);

    if (!roleMention) {
      return message.reply(
        "❌ Invalid role."
      );
    }

    const supportRole =
      message.guild.roles.cache.get(
        roleMention[1]
      );

    if (!supportRole) {
      return message.reply(
        "❌ Role not found."
      );
    }

    // ================= SAVE =================

    const data = load();

    data[message.guild.id] = {

      title,
      description,

      panelChannel:
        panelChannel.id,

      supportRole:
        supportRole.id,

      categories

    };

    save(data);

    // ================= DROPDOWN =================

    const menu =
      new StringSelectMenuBuilder()

        .setCustomId(
          "ticket_dropdown"
        )

        .setPlaceholder(
          "Select ticket category"
        )

        .addOptions(

          categories.map(cat => ({
            label: cat,
            value: cat.toLowerCase(),
            description:
              `Open ${cat} ticket`
          }))

        );

    const row =
      new ActionRowBuilder()
        .addComponents(menu);

    const embed =
      new EmbedBuilder()

        .setColor("Aqua")

        .setTitle(title)

        .setDescription(description);

    await panelChannel.send({

      embeds: [embed],

      components: [row]

    });

    return message.reply(
      "✅ Ticket system setup completed."
    );
  }
};
