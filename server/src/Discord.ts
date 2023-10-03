import { REST, Routes, Client, IntentsBitField, TextChannel } from "discord.js";
import { AppDataSource, GetGameState } from "./DataSource";
import { MUser } from "./models/MUser";

const GUILD_ID =
  process.env.NODE_ENV == "development"
    ? process.env.DEV_DISCORD_GUILD_ID
    : process.env.DISCORD_GUILD_ID;
const CHANNEL_ID =
  process.env.NODE_ENV == "development"
    ? process.env.DEV_DISCORD_CHANNEL_ID
    : process.env.DISCORD_CHANNEL_ID;

export default class Discord {
  private static rest: REST;
  private static client: Client;
  private static running: boolean;

  static async Initalize() {

    if(Number.parseInt(process.env.FEATURE_DISCORD as string) != 1){
      console.warn("WARNING: DISCORD FEATURE DISABLED");
      return;
    }

    this.rest = new REST({ version: "10" }).setToken(
      process.env.DISCORD_TOKEN as string
    );

    this.running = true;

    await this.Send();

    this.client = new Client({
      intents: [IntentsBitField.Flags.Guilds],
    });

    this.client.on("ready", () => {
      console.log("Client Ready");
      console.log(`Logged in as ${this.client.user?.tag}!`);
    });

    this.client.on("interactionCreate", async (interaction) => {
      if (!interaction.isCommand()) return;

      if (interaction.user.id !== process.env.DISCORD_ADMIN_ID) {
        interaction.reply({
          content: "Sorry, you can't control the notification bot",
          ephemeral: true,
        });
        return;
      }

      if (interaction.guildId != GUILD_ID) {
        return;
      }

      console.log(`Got command '${interaction.commandName}'`);

      if (interaction.commandName == "start") {
        this.running = true;
        await interaction.reply("Starting!");
      } else if (interaction.commandName == "stop") {
        this.running = false;
        await interaction.reply("Stopping!");
      } else if (interaction.commandName == "status") {
        const gameState = GetGameState();

        const currentDrafter = await AppDataSource.manager.findOne(MUser, {
          where: { id: gameState.currentDrafterId },
        });

        const nextID = () => {
          const idx = gameState.draftOrderIds.indexOf(
            gameState.currentDrafterId
          );
          if (gameState.draftOrderIds[idx + 1]) {
            return gameState.draftOrderIds[idx + 1];
          }
          return gameState.draftOrderIds[0];
        };

        const nextDrafter = await AppDataSource.manager.findOne(MUser, {
          where: { id: nextID() },
        });

        await interaction.reply(`
        STATUS REPORT:
            Bot State: ${this.running ? "Running" : "Stopped"}
            Game Phase: ${gameState.phase}
            Current Drafter: ${currentDrafter?.first_name} ${
          currentDrafter?.last_name
        }
            Next Drafter: ${nextDrafter?.first_name} ${nextDrafter?.last_name}
            Round [${gameState.currentRound}/${gameState.draftRounds}]`);
      } else if (interaction.commandName == "poke") {
        if (!this.running) {
          await interaction.reply({
            content: "Bot not running. Use /start to restart it before poking.",
            ephemeral: true,
          });
          return;
        }

        const gameState = GetGameState();

        const currentDrafter = await AppDataSource.manager.findOne(MUser, {
          where: { id: gameState.currentDrafterId },
        });

        if (currentDrafter) {
          this.SendReminder(currentDrafter);
          await interaction.reply({
            content: "Sending Reminder",
            ephemeral: true,
          });
          return;
        }

        await interaction.reply({
          content: "Something went wrong... currentDrafter is null...",
          ephemeral: true,
        });
        return;
      }
    });

    this.client.login(process.env.DISCORD_TOKEN);
  }

  static SendReminder(user: MUser) {
    this.SendMessage(`Hey ${user.first_name}, it's your turn to draft! 🥳\n\nhttp://www.axotech.io/ill/`);
  }

  static SendMessage(msg: string) {
    if (!this.running) {
      return;
    }

    const guild = this.client.guilds.cache.get(GUILD_ID as string);
    if (!guild) {
      console.error("Unable to find guild: " + GUILD_ID);
      return;
    }

    const channel = guild.channels.cache.get(CHANNEL_ID as string);
    if (!channel) {
      console.error("Unable to find channel: " + CHANNEL_ID);
      return;
    }

    if (!channel.isTextBased()) {
      console.error("Channel is not text.");
      return;
    }

    (channel as TextChannel).send(msg);
  }

  private static async Send() {
    try {
      console.log("Sending Commands");

      await this.rest.put(
        Routes.applicationGuildCommands(
          process.env.DISCORD_CLIENT_ID as string,
          GUILD_ID as string
        ),
        {
          body: commands,
        }
      );

      console.log("Success");
    } catch (error) {
      console.error(error);
    }
  }
}

const commands: { name: string; description: string }[] = [
  {
    name: "start",
    description: "Starts the notification Bot",
  },
  {
    name: "stop",
    description: "Stops the notification Bot",
  },
  {
    name: "status",
    description: "Prints current state information",
  },
  {
    name: "poke",
    description: "Sends a message to the current drafter to remind them",
  },
  {
    name: "set-channel",
    description: "Followed by and ID this is the channel the bot will use",
  },
];
