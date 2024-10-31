require("dotenv").config(); // used for environment variables
const { Client: AttClient } = require("att-client"); //main att client
const { myBotConfig } = require("./config"); // used for bot configuration
const { Prefab } = require("att-string-transcoder");
const { say } = require("say"); // for text to speech

const attClient = new AttClient(myBotConfig); // Defines attClient as a client using the bot configuration
const connections = []; //array to store connections to servers to access outside of the connect event stream
exports.attbot = attClient;
//--------------------------------------------------------------------------------

// This main function is where we will run the bot from
/**
 * @function main
 * @description This function is the main function that will run the bot
 * @returns {Promise<void>}
 * @example
 * main()
 *
 */

async function main() {
  await attClient.start(); //starts the bot

  attClient.on("connect", (connection) => {
    // this event stream will call when the bot connects to the server
    console.log(`Console connection established to ${connection.server.name}.`); // Will log every time Client connect to a game server.
   connections.push(connection); //pushes the connection to the connections array to access outside of the event stream
    say.speak(`connection established to ${connection.server.name}`)

    const WhiteList = [
      "608286242",
      "ID",
      "ID",
      "ID",
      "ID",
      "ID",
      "ID",
      "ID",
      // Add more IDs if needed
    ];

    connection.subscribe("PlayerLeft", async (event) => {
      const LBOZO = event.data.user.username;

      if (LBOZO === "MinerAlex") {
        connection.send('player message * "Bro has left the game" 5');
        console.log("Bro has left the game"); //sends a message to the console onece the command finishes
      }
    });

    connection.subscribe("PlayerJoined", async (event) => {
      const { user, mode, position } = event.data;

      console.log(`[SERVER] ${user.username}/${user.id} has joined the server`);
      console.log(
        `[SERVER] ${user.username}/${user.id} joining position: ${position}`
      );
      console.log(`[SERVER] ${user.username}/${user.id} Joined Mode ${mode}`);

      connection.send(
        `player message * "${user.name}/${user.id} has joined the server" 2`
      );

      if (user === `MinerAlex`) {
        connection.send(`player message * "PLUH" 6`);
        connection.send(`player modify-stat * Luminosity -9999 5`).catch((error) => {console.error(`${response.data.Result}`, error);});
      }
    });

    connection.subscribe("PlayerStateChanged", async (event) => {
      if (
        event.data.user.username.includes("MinerAlex") &&
        event.data.state === "Dead"
      ) {
        connection.send(``);
      }
    });

    connection.subscribe("SocialTabletPlayerReported", async (event) => {
      const { ReportedBy, ReportedPlayer, Reason } = event.data;

      attClient.api
        .getGroupMember(connection.server.group.id, ReportedBy.id)
        .then(async (GroupMember) => {
          if (
            Reason.includes("Harrassment") &&
            (GroupMember.permissions.includes("Moderator") ||
              (GroupMember.permissions.includes("Owner") &&
                ServerData.tabletCommands))
          ) {
            connection.send(
              `player message ${ReportedBy.id} "Initializing teleportation." 2`
            );

            setTimeout(function () {
              connection.send(
                `player teleport ${ReportedBy.id} ${ReportedPlayer.id}`
              );
              connection.send(
                `player message ${ReportedBy.id} "You have teleported to ${ReportedPlayer.username}." 2`
              );
            }, 3000);
          }

          if (
            Reason.includes("Griefing") &&
            (GroupMember.permissions.includes("Moderator") ||
              (GroupMember.permissions.includes("Owner") &&
                ServerData.tabletCommands))
          ) {
            connection.send(
              `player message ${ReportedBy.id} "To the you know what dungeon." 2`
            );

            setTimeout(function () {
              connection.send(
                `player set-home ${ReportedPlayer.id} -867.153,573.735,-1715.633`
              );
              connection.send(`player teleport ${ReportedPlayer.id} home`);
              connection.send(
                `player message ${ReportedPlayer.id} "You have been sent to jail untill futher notice." 4`
              );
              connection.send(`player set-home ${ReportedPlayer.id} 0,0,0`);
              connection.send(
                `player message ${ReportedBy.id} "You have sent ${ReportedPlayer.username} to the sussy dungeon." 2`
              );
            }, 3000);
          }

          if (
            Reason.includes("CheatingExploits") &&
            (GroupMember.permissions.includes("Moderator") ||
              (GroupMember.permissions.includes("Owner") &&
                ServerData.tabletCommands))
          ) {
            connection.send(`player message * "Debug Time." 5`);

            setTimeout(function () {}, 2000);
          }
        });
    });

    connection.subscribe("InventoryChanged", async (event) => {
      const { User } = event.data;
      const itemName = event.data.ItemName.toLowerCase();
      const changeType = event.data.ChangeType;

      if (itemName.includes("iron key") && changeType === "Dock")
        if (WhiteList.includes(`${User.id}`)) {
          connection.send(`player message ${User.id} "yummy" 6`);
          connection.send(`player modify-stat ${User.id} damage 99999 180`);
          connection.send(`player modify-stat ${User.id} damageprotection 31 180`);
          connection.send(`player modify-stat ${User.id} speed 4 180`);
          connection.send(`player set-stat ${User.id} hunger 2`);
        }

      if (itemName.includes("candy") && changeType === "Dock") {
        if (WhiteList.includes(`${User.id}`)) {
          connection.send(`festivities start 9252`);
        }
      }

      if (itemName.includes("flower red") && changeType === "Dock")
        if (WhiteList.includes(`${User.id}`)) {
          connection.send(`player inventory ${User.id}`).then((response) => {
              connection.send(`wacky replace ${response.data.Result[0].RightHand["Identifier"] || response.data.Result[0].RightHand["prefabHash"]}`);
            })
            .catch((error) => {
              console.error("OH NO ITS ALL OVER MY SCREEN", error);
              say.speak('OH MY GOODNESS')
            });
          console.log(`${User} replaced item`);
        }

      let dmessage = "";
      if (itemName.includes(`smelter gem`) && changeType === "Dock") {
        if (WhiteList.includes(`${User.id}`))
          for (var i in connection.server.players) {
            let oplayer = connection.server.players[i];
            dmessage += oplayer.username + "\n";
          }
        connection.send(`player message ${User.id} "${dmessage}" 6`);
        console.log(`player list`);
      }

      if (itemName.includes("flower blue") && changeType === "Dock") {
        connection.send(`player detailed ${User.id}`).then((response) => {
            const RDR = response.data.Result;
            let resultString = "";

            for (let i in RDR) {
              if (i === "Position") {
                RDR[i].Y = Math.random() * 50; // Set the Y position to a random value between 0 and 50
                resultString += `${i} ${RDR[i]}\n`;
              }
            }

            console.log(resultString);
          }).catch((error) => {
            console.error("OH MY GOODNESS:", error);
            say.speak('OH MY GOODNESS')
          });
      }

      if (itemName.includes("debug") && changeType === "Dock") {
        connection.send(`debug server-stats`).then((response) => {
            const DRDR = response.data.Result;
            let resultString = "";

            for (let i in DRDR) {
              resultString += `${i} ${DRDR[i]}\n`;
            }

            console.log(resultString);
            connection.send(`player message ${User.id} ${resultString}`);
          })
          .catch((error) => {
            console.error("OH MY GOODNESS:", error);
            say.speak('OH MY GOODNESS')
          });
      }
    });

    connection.subscribe("CommandExecuted", async (event) => { // CommandExecuted will be used for voice commands
        var pluhCOMMAND = event.data.Command;
        const me = 'MinerAlex';

        if (pluhCOMMAND === "PLUH") {
          connection.send(`player message * "PLUH" 6`);
          console.log(`PLUH`);
          say.speak('PLUH')
        }
      }

      // LINK subscriptionreturns.txt
      // for more information on the event stream
    );
    runcommands(); //runs the commands function
  });

  function runcommands() {
    //command example

    var connection = connections.find((connection) => connection.server.id); //finds the connection to the server
    if (!connection) {
      return console.error("oh my pluh");
    }
  }
}
main();

const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Events, GatewayIntentBits } = require("discord.js");
const token = process.env.TOKEN;

const DiscordClient = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

DiscordClient.commands = new Collection();
const foldersPath = path.join(__dirname, "commands");
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
  const commandsPath = path.join(foldersPath, folder);
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".js"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    if ("data" in command && "execute" in command) {
      DiscordClient.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }
}

DiscordClient.once(Events.ClientReady, (readyClient) => {
  console.log(`Logged in as ${readyClient.user.tag}`);
});

DiscordClient.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
});

DiscordClient.login(token).catch(console.error);