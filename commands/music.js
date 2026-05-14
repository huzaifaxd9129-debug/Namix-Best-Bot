const { EmbedBuilder } = require("discord.js");
const { Player, QueryType } = require("discord-player");
const { YoutubeiExtractor } = require("discord-player-youtubei");

// ================= COLOR =================

const COLOR = "#2b2d31";

// ================= PLAYER SINGLETON =================
// One Player instance is shared across all commands via client.musicPlayer.
// It is initialised lazily on first use so the client is fully ready.

function getPlayer(client) {
  if (!client.musicPlayer) {
    client.musicPlayer = new Player(client, {
      ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
      }
    });

    // Register the YouTube extractor
    client.musicPlayer.extractors.register(YoutubeiExtractor, {});

    // ================= PLAYER EVENTS =================

    client.musicPlayer.events.on("playerStart", (queue, track) => {
      const embed = new EmbedBuilder()
        .setColor(COLOR)
        .setTitle("🎵 Now Playing")
        .setDescription(`**[${track.title}](${track.url})**`)
        .addFields(
          { name: "Duration",   value: track.duration,            inline: true },
          { name: "Requested by", value: `${track.requestedBy}`, inline: true }
        )
        .setThumbnail(track.thumbnail)
        .setFooter({ text: "Nexora Music" });

      queue.metadata.channel.send({ embeds: [embed] }).catch(() => {});
    });

    client.musicPlayer.events.on("emptyQueue", (queue) => {
      queue.metadata.channel
        .send("✅ Queue finished — disconnecting.")
        .catch(() => {});
    });

    client.musicPlayer.events.on("emptyChannel", (queue) => {
      queue.metadata.channel
        .send("👋 Voice channel empty — disconnecting.")
        .catch(() => {});
    });

    client.musicPlayer.events.on("error", (queue, error) => {
      console.error("[Music] Queue error:", error);
      queue.metadata.channel
        .send(`❌ An error occurred: \`${error.message}\``)
        .catch(() => {});
    });

    client.musicPlayer.events.on("playerError", (queue, error) => {
      console.error("[Music] Player error:", error);
      queue.metadata.channel
        .send(`❌ Player error: \`${error.message}\``)
        .catch(() => {});
    });
  }

  return client.musicPlayer;
}

// ================= HELPERS =================

function voiceCheck(message) {
  const vc = message.member?.voice?.channel;
  if (!vc) {
    message.reply("❌ You must be in a voice channel to use music commands.");
    return null;
  }
  return vc;
}

// ================= COMMAND =================

module.exports = {
  name: "music",
  aliases: ["m", "play"],

  async execute(message, args, client) {

    // When invoked via the "play" alias with no subcommand,
    // treat the entire args array as the song query.
    const invokedAs = message.content
      .trim()
      .slice(1)
      .split(/ +/)[0]
      .toLowerCase();

    let sub = args[0]?.toLowerCase();

    // !play <query>  →  treat as  !music play <query>
    if (invokedAs === "play" && sub !== "play") {
      args.unshift("play");
      sub = "play";
    }

    const player = getPlayer(client);

    // ================= PLAY =================

    if (sub === "play") {
      const vc = voiceCheck(message);
      if (!vc) return;

      const query = args.slice(1).join(" ");
      if (!query) {
        return message.reply("❌ Provide a song name or URL.\n**Usage:** `!music play <song name or URL>`");
      }

      const searching = await message.reply("🔍 Searching...");

      try {
        const { track } = await player.play(vc, query, {
          nodeOptions: {
            metadata: {
              channel: message.channel,
              requestedBy: message.author
            },
            selfDeaf: true,
            volume: 80,
            leaveOnEmpty: true,
            leaveOnEmptyCooldown: 30000,
            leaveOnEnd: true,
            leaveOnEndCooldown: 30000
          },
          requestedBy: message.author,
          searchEngine: QueryType.AUTO
        });

        const embed = new EmbedBuilder()
          .setColor(COLOR)
          .setTitle("✅ Added to Queue")
          .setDescription(`**[${track.title}](${track.url})**`)
          .addFields(
            { name: "Duration",     value: track.duration,            inline: true },
            { name: "Requested by", value: `${message.author}`,       inline: true }
          )
          .setThumbnail(track.thumbnail)
          .setFooter({ text: "Nexora Music" });

        await searching.edit({ content: null, embeds: [embed] });

      } catch (err) {
        console.error("[Music] Play error:", err);
        await searching.edit(`❌ Could not play that track: \`${err.message}\``);
      }

      return;
    }

    // ================= STOP =================

    if (sub === "stop") {
      const vc = voiceCheck(message);
      if (!vc) return;

      const queue = player.nodes.get(message.guild.id);
      if (!queue || !queue.isPlaying()) {
        return message.reply("❌ Nothing is playing right now.");
      }

      queue.delete();
      return message.reply("⏹️ Stopped the music and disconnected.");
    }

    // ================= SKIP =================

    if (sub === "skip") {
      const vc = voiceCheck(message);
      if (!vc) return;

      const queue = player.nodes.get(message.guild.id);
      if (!queue || !queue.isPlaying()) {
        return message.reply("❌ Nothing is playing right now.");
      }

      const current = queue.currentTrack;
      queue.node.skip();
      return message.reply(`⏭️ Skipped **${current?.title ?? "the current track"}**.`);
    }

    // ================= QUEUE =================

    if (sub === "queue") {
      const queue = player.nodes.get(message.guild.id);
      if (!queue || !queue.isPlaying()) {
        return message.reply("❌ Nothing is playing right now.");
      }

      const tracks = queue.tracks.toArray();
      const current = queue.currentTrack;

      const embed = new EmbedBuilder()
        .setColor(COLOR)
        .setTitle("🎶 Current Queue")
        .setFooter({ text: `Nexora Music • ${tracks.length} track(s) in queue` });

      let desc = `**Now Playing:**\n🎵 [${current?.title}](${current?.url}) — \`${current?.duration}\`\n\n`;

      if (tracks.length === 0) {
        desc += "*No upcoming tracks.*";
      } else {
        desc += "**Up Next:**\n";
        desc += tracks
          .slice(0, 10)
          .map((t, i) => `\`${i + 1}.\` [${t.title}](${t.url}) — \`${t.duration}\``)
          .join("\n");

        if (tracks.length > 10) {
          desc += `\n*...and ${tracks.length - 10} more track(s).*`;
        }
      }

      embed.setDescription(desc);
      return message.channel.send({ embeds: [embed] });
    }

    // ================= PAUSE =================

    if (sub === "pause") {
      const vc = voiceCheck(message);
      if (!vc) return;

      const queue = player.nodes.get(message.guild.id);
      if (!queue || !queue.isPlaying()) {
        return message.reply("❌ Nothing is playing right now.");
      }

      if (queue.node.isPaused()) {
        return message.reply("⏸️ The music is already paused. Use `!music resume` to continue.");
      }

      queue.node.pause();
      return message.reply("⏸️ Paused the music.");
    }

    // ================= RESUME =================

    if (sub === "resume") {
      const vc = voiceCheck(message);
      if (!vc) return;

      const queue = player.nodes.get(message.guild.id);
      if (!queue) {
        return message.reply("❌ Nothing is in the queue.");
      }

      if (!queue.node.isPaused()) {
        return message.reply("▶️ The music is already playing.");
      }

      queue.node.resume();
      return message.reply("▶️ Resumed the music.");
    }

    // ================= VOLUME =================

    if (sub === "volume") {
      const vc = voiceCheck(message);
      if (!vc) return;

      const queue = player.nodes.get(message.guild.id);
      if (!queue || !queue.isPlaying()) {
        return message.reply("❌ Nothing is playing right now.");
      }

      const vol = parseInt(args[1]);
      if (isNaN(vol) || vol < 0 || vol > 100) {
        return message.reply("❌ Provide a volume between `0` and `100`.\n**Usage:** `!music volume <0-100>`");
      }

      queue.node.setVolume(vol);
      return message.reply(`🔊 Volume set to **${vol}%**.`);
    }

    // ================= NOWPLAYING =================

    if (sub === "nowplaying" || sub === "np") {
      const queue = player.nodes.get(message.guild.id);
      if (!queue || !queue.isPlaying()) {
        return message.reply("❌ Nothing is playing right now.");
      }

      const track = queue.currentTrack;
      const progress = queue.node.createProgressBar();

      const embed = new EmbedBuilder()
        .setColor(COLOR)
        .setTitle("🎵 Now Playing")
        .setDescription(`**[${track.title}](${track.url})**\n\n${progress}`)
        .addFields(
          { name: "Duration",     value: track.duration,      inline: true },
          { name: "Requested by", value: `${track.requestedBy}`, inline: true },
          { name: "Volume",       value: `${queue.node.volume}%`, inline: true }
        )
        .setThumbnail(track.thumbnail)
        .setFooter({ text: "Nexora Music" });

      return message.channel.send({ embeds: [embed] });
    }

    // ================= UNKNOWN / HELP =================

    const helpEmbed = new EmbedBuilder()
      .setColor(COLOR)
      .setTitle("🎵 Music Commands")
      .setDescription(
`**!music play <song name or URL>** — Search and play a song
**!music stop** — Stop music and disconnect
**!music skip** — Skip the current track
**!music queue** — Show the current queue
**!music pause** — Pause the current track
**!music resume** — Resume a paused track
**!music volume <0-100>** — Set the volume
**!music nowplaying** — Show what's currently playing

**Aliases:** \`!play\`, \`!m\``
      )
      .setFooter({ text: "Nexora Music" });

    return message.channel.send({ embeds: [helpEmbed] });
  }
};
