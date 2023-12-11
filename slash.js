var start = new Date();
const { REST, SlashCommandBuilder, Routes } = require("discord.js");
const commands = [
  new SlashCommandBuilder()
    .setName("gpt")
    .setDescription("Configure GPT")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("set")
        .setDescription("Set GPTs on this channel")
        .addStringOption((option) =>
          option
            .setName("gpt")
            .setDescription("Select GPT you want")
            .setRequired(true)
            .addChoices(
              { name: "GPT-4", value: "1" },
              { name: "GPT-4-0613", value: "2" },
              { name: "GPT-4-32k", value: "3" },
              { name: "GPT-4-0314", value: "4" },
              { name: "GPT-4-32k-0314", value: "5" },
              { name: "GPT-3.5-Turbo", value: "6" },
              { name: "GPT-3.5-Turbo-16k", value: "7" },
              { name: "GPT-3.5-Turbo-0613", value: "8" },
              { name: "GPT-3.5-Turbo-16k-0613", value: "9" },
              { name: "GPT-3.5-Turbo-0301", value: "10" },
              { name: "Text-DaVinci-003", value: "11" },
              { name: "Text-DaVinci-002", value: "12" },
              { name: "Code-Davinci-002", value: "13" },
              { name: "GPT-3", value: "14" },
              { name: "Text-Curie-001", value: "15" },
              { name: "Text-Babbage-001", value: "16" },
              { name: "Text-Ada-001", value: "17" },
              { name: "Davinci", value: "18" },
              { name: "Curie", value: "19" },
              { name: "Babbage", value: "20" },
              { name: "Ada", value: "21" },
              { name: "Babbage-002", value: "22" },
              { name: "Davinci-002", value: "23" },
              { name: "reset", value: "reset" },
            ),
        ),
    ),
].map((command) => command.toJSON());
const rest = new REST({ version: "10" }).setToken(process.env.token);
const reset = [];
rest
  .put(Routes.applicationCommands(process.env.applicationId), { body: commands })
  .then((data) =>
    console.log(
      `Successfully registered ${data.length} application commands with ${
        (new Date() - start) / 1000
      }s`,
    ),
  )
  .catch(console.error);
