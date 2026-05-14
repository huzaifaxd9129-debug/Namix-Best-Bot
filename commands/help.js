const {
  EmbedBuilder,
  ActionRowBuilder,
  StringSelectMenuBuilder
} = require("discord.js");

module.exports = {
  name: "help",

  execute: async (message) => {

    // ================= MAIN EMBED =================
    const home = new EmbedBuilder()
      .setColor("#2b2d31")
      .setTitle("💎 Nexora Help Menu")
      .setDescription(
`> Select a category from the dropdown below to explore commands
> Type \`!help <command>\` for details

 💡 [Invite Bot](https://discord.com/oauth2/authorize?client_id=1503749315787489372&permissions=8&scope=bot%20applications.commands)
 🎉 [Support Server](https://dsc.gg/darknezz)

Thanks for using **Nexora**`
      )
      .setImage("https://media.discordapp.net/attachments/1500169350307647488/1504499940720902224/yourimage.png")
      .setFooter({ text: "Nexora | Help Panel" });

    // ================= DROPDOWN =================
    const menu = new ActionRowBuilder().addComponents(
      new StringSelectMenuBuilder()
        .setCustomId("help_menu")
        .setPlaceholder("📂 Select a category")

        .addOptions([
          {
            label: "Premium Commands",
            value: "premium",
            description: "stats, weather, relationship...",
            emoji: "💎"
          },
          {
            label: "Economy Commands (16)",
            value: "eco",
            description: "daily, balance, work, gamble, shop...",
            emoji: "💰"
          },
          {
            label: "Fun Commands (12)",
            value: "fun",
            description: "iq, hot, 8ball, roll, rps...",
            emoji: "🎮"
          },
          {
            label: "Utility Commands (25+)",
            value: "util",
            description: "avatar, ping, serverinfo, snipe...",
            emoji: "⚙️"
          },
          {
            label: "Moderation Commands",
            value: "mod",
            description: "kick, ban, mute, timeout, slowmode...",
            emoji: "🛡️"
          },
          {
            label: "AI System",
            value: "ai",
            description: "chatbot enable/disable setup",
            emoji: "🤖"
          },
          {
            label: "AutoResponder",
            value: "ar",
            description: "create, delete, edit autoresponder",
            emoji: "💬"
          },
          {
            label: "Automod",
            value: "automod",
            description: "enable / disable protection",
            emoji: "🚨"
          },
          {
            label: "Welcome System",
            value: "welcome",
            description: "welcome config, test, variables",
            emoji: "👋"
          },
          {
            label: "Giveaways",
            value: "giveaway",
            description: "gstart, gend, greroll, gedit",
            emoji: "🎉"
          },
          {
            label: "Applications",
            value: "app",
            description: "create, list, send applications",
            emoji: "📄"
          },
          {
            label: "Booster System",
            value: "booster",
            description: "booster channel setup & message",
            emoji: "🚀"
          },
          {
            label: "Music System",
            value: "music",
            description: "play, skip, stop, queue...",
            emoji: "🎵"
          }
        ])
    );

    // ================= SEND =================
    const msg = await message.channel.send({
      embeds: [home],
      components: [menu]
    });

    // ================= COLLECTOR =================
    const collector = msg.createMessageComponentCollector({
      time: 600000
    });

    collector.on("collect", async (interaction) => {

      if (!interaction.isStringSelectMenu()) return;
      if (interaction.customId !== "help_menu") return;

      const value = interaction.values[0];

      let embed = new EmbedBuilder().setColor("#2b2d31");

      // ================= MODERATION =================
      if (value === "mod") {
        embed
          .setTitle("🛡️ Moderation Commands")
          .setDescription(
`kick, ban, mute, unmute, timeout, untimeout, warn, warnings, clear,
purge, lock, unlock, hide, unhide, slowmode, addrole, removerole,
nuke, nickname, unban, massban, antiinvite, softban, clearwarns, userinfo

📊 Total: 25 Commands`
          );
      }

      // ================= ECONOMY =================
      else if (value === "eco") {
        embed
          .setTitle("💰 Economy Commands")
          .setDescription(
`daily, balance, work, beg, crime, rob, deposit, withdraw,
leaderboard, gamble, inventory, marry, pay, search, shop, buy

📊 Total: 16 Commands`
          );
      }

      // ================= FUN =================
      else if (value === "fun") {
        embed
          .setTitle("🎮 Fun Commands")
          .setDescription(
`howgay, howcool, iq, hot, 8ball, roll, choose, quickpoll,
rockpaperscissors, uselessfact, emojify, morse

📊 Total: 12 Commands`
          );
      }

      // ================= UTILITY =================
      else if (value === "util") {
        embed
          .setTitle("⚙️ Utility Commands")
          .setDescription(
`help, avatar, userinfo, serverinfo, ping, uptime, membercount,
roleinfo, servericon, serverbanner, serversplash, snipe,
editsnipe, reactionsnipe, afk, inrole, roles, bots, boosters,
seen, firstmessage, clearsnipes, birthday

📊 Total: 25+ Commands`
          );
      }

      // ================= PREMIUM =================
      else if (value === "premium") {
        embed
          .setTitle("💎 Premium Commands")
          .setDescription(
`stats, weather, relationship, urlshortener, birthday set

📊 Premium Features`
          );
      }

      // ================= AI =================
      else if (value === "ai") {
        embed
          .setTitle("🤖 AI System")
          .setDescription(
`setup-chatbot, chatbot enable, chatbot disable

📊 AI Chat System`
          );
      }

      // ================= AUTORESPONDER =================
      else if (value === "ar") {
        embed
          .setTitle("💬 AutoResponder")
          .setDescription(
`autoresponder create, delete, edit, list

📊 Auto Reply System`
          );
      }

      // ================= AUTOMOD =================
      else if (value === "automod") {
        embed
          .setTitle("🚨 Automod System")
          .setDescription(
`automod enable, automod disable

📊 Protection System`
          );
      }

      // ================= WELCOME =================
      else if (value === "welcome") {
        embed
          .setTitle("👋 Welcome System")
          .setDescription(
`welcome config, welcome delete, welcome test, welcome variables

📊 Welcomer System`
          );
      }

      // ================= GIVEAWAY =================
      else if (value === "giveaway") {
        embed
          .setTitle("🎉 Giveaway Commands")
          .setDescription(
`gstart, gend, greroll, gedit

📊 Giveaway System`
          );
      }

      // ================= APPLICATIONS =================
      else if (value === "app") {
        embed
          .setTitle("📄 Application System")
          .setDescription(
`createapplication, listapplications, removeapplication, sendapplication

📊 Recruitment System`
          );
      }

      // ================= BOOSTER =================
      else if (value === "booster") {
        embed
          .setTitle("🚀 Booster System")
          .setDescription(
`booster channel setup, booster message edit

📊 Booster System`
          );
      }

      // ================= MUSIC =================
      else if (value === "music") {
        embed
          .setTitle("🎵 Music System")
          .setDescription(
`play, skip, stop, pause, resume, queue, nowplaying

📊 Music System`
          );
      }

      await interaction.update({
        embeds: [embed],
        components: [menu]
      });
    });

    collector.on("end", () => {
      msg.edit({ components: [] }).catch(() => {});
    });
  }
};
