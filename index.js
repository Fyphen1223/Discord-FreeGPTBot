const express = require("express");
const app = express();

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(8080, () => {
  console.log("Example app listening on port 3000!");
});

const discord = require("discord.js");
const client = new discord.Client({
  intents: [
    discord.GatewayIntentBits.DirectMessageReactions,
    discord.GatewayIntentBits.DirectMessageTyping,
    discord.GatewayIntentBits.DirectMessages,
    discord.GatewayIntentBits.GuildBans,
    discord.GatewayIntentBits.GuildEmojisAndStickers,
    discord.GatewayIntentBits.GuildIntegrations,
    discord.GatewayIntentBits.GuildInvites,
    discord.GatewayIntentBits.GuildMembers,
    discord.GatewayIntentBits.GuildMessageReactions,
    discord.GatewayIntentBits.GuildMessageTyping,
    discord.GatewayIntentBits.GuildMessages,
    discord.GatewayIntentBits.GuildPresences,
    discord.GatewayIntentBits.GuildScheduledEvents,
    discord.GatewayIntentBits.GuildVoiceStates,
    discord.GatewayIntentBits.GuildWebhooks,
    discord.GatewayIntentBits.Guilds,
    discord.GatewayIntentBits.MessageContent,
  ],
  partials: [
    discord.Partials.Channel,
    discord.Partials.GuildMember,
    discord.Partials.GuildScheduledEvent,
    discord.Partials.Message,
    discord.Partials.Reaction,
    discord.Partials.ThreadMember,
    discord.Partials.User,
  ],
});
const { gpts } = require("./gpt-client.js");
const gptQueue = new gpts();
const axios = require("axios");

client.on("ready", (user) => {
  console.log(`Logged in as ${user.user.tag}`);
  return;
});

function splitString(str) {
  if (str.length <= 2000) {
    return [str];
  }
  const chunks = [];
  for (let i = 0; i < str.length; i += 2000) {
    chunks.push(str.slice(i, i + 2000));
  }
  return chunks;
}

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;
  if (!gptQueue[message.channel.id]) return;
  await message.channel.sendTyping();
  try {
    const res = await gptQueue[message.channel.id].generate(message);
    const toBeSent = splitString(res);
    toBeSent.forEach(async (chunk) => {
      await message.channel.send(chunk);
    });
    return;
  } catch (err) {
    console.log(err.stack);
    await message.reply(
      "Sorry, the API failed to execute properly. Please try again later.",
    );
    return;
  }
});

client.on("interactionCreate", async (interaction) => {
  const guildId = interaction.guild.id;
  if (interaction.commandName === "gpt") {
    await interaction.deferReply();
    const option = interaction.options.getString("gpt");
    if (option === "reset") {
      try {
        delete gptQueue[interaction.channel.id];
        await interaction.editReply(
          "Reset GPT, I no longer answer questions in this channel.",
        );
        return;
      } catch (err) {}
    }
    if (!gptQueue[guildId]) {
      gptQueue.add(interaction.channel.id, Number(option));
      await interaction.editReply(`Set ${option} on this channel.`);
      return;
    } else {
      try {
        delete gptQueue[interaction.channel.id];
      } catch (err) {}
      gptQueue.add(interaction.channel.id, option);
      await interaction.editReply(`Set ${option} on this channel.`);
      return;
    }
  }
});

client.login(process.env.token);

process.on("uncaughtException", function (err) {
  console.log(err.stack);
  return;
});
