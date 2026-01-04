const { Client, GatewayIntentBits } = require("discord.js");
const {
  joinVoiceChannel,
  getVoiceConnection
} = require("@discordjs/voice");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildVoiceStates
  ]
});
// ===== CONFIG =====

const PREFIX = "!";
const VOICE_CHANNEL_ID = "VOICE CHANNEL ID HERE";
const BOT_TOKEN = "BOT TOKEN HERE"

// ==================

client.on("clientReady", () => {
    console.log(`Logged in as ${client.user.tag}`);
})

client.on("messageCreate", async (message) => {
  if (!message.guild || !message.content.startsWith(PREFIX)) return;

  const cmd = message.content.slice(1).trim();

  if (cmd === "joinvc") {
    const channel = message.guild.channels.cache.get(VOICE_CHANNEL_ID);
    if (!channel || !channel.isVoiceBased()) {
      return message.reply("VC not found.");
    }

    if (getVoiceConnection(message.guild.id)) {
      return message.reply("Already in VC.");
    }

    joinVoiceChannel({
      channelId: channel.id,
      guildId: message.guild.id,
      adapterCreator: message.guild.voiceAdapterCreator
    });

    message.reply("Joined VC.");
  }

  if (cmd === "leavevc") {
    const connection = getVoiceConnection(message.guild.id);
    if (!connection) {
      return message.reply("Not in a VC.");
    }

    connection.destroy();
    message.reply("Left VC.");
  }
});
client.login(BOT_TOKEN);
