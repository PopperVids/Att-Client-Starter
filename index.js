require('dotenv').config();
const { Client: DiscordClient, Events, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const { Client: AttClient } = require('att-client');
const { myUserConfig } = require('./config');

// Create a new Discord client instance
const discordClient = new DiscordClient({ intents: [GatewayIntentBits.Guilds] });

// Create a new ATT client instance
const attClient = new AttClient(myUserConfig);
const connections = [];

//1724889222 = a hot tale pcvr
//326671867 = a hot tale
//1717578363 = a testing tale

let server_id = 1717578363; // The server ID to connect to

// Logs when the Discord Bot is ready
discordClient.once(Events.ClientReady, readyClient => {
  console.log(`Logged in as ${readyClient.user.tag}`);
});

// Log in to Discord with A client token
discordClient.login(token);

// Main function to run ATT client
async function main() {
  await attClient.start(); // Starts ATT client

  attClient.openServerConnection(server_id); // Opens a connection to the server with the id of server_id

  attClient.on('connect', connection => {
    console.log(`Console connection established to ${connection.server.name}.`);
    connections.push(connection); // Pushes the connection to the connections array to access outside of the event stream

    // Example of subscribing to a server event stream
    connection.subscribe('PlayerStateChanged', (event) => {
      const NotNice = event.data.user.username;

      if (NotNice === 'MinerAlex') { // Checks if the player that entered combat is MinerAlex
        connection.send('player modify-stat 608286242 speed 7 180');
        connection.send('player modify-stat 608286242 damage 99999 180');
        connection.send('player modify-stat 608286242 DamageProtection 15 180');
        connection.send('player set-stat 608286242 hunger 2');
        connection.send('player message MinerAlex "get buffed" 5'); // Sends a message to the console once the command finishes
        connection.send('player message * "Grrrrrrrrrrrrrrrrr" 10');
        console.log('Bro has been buffed');
      }
    });

    runCommands(); // Runs the commands function
  });

  function runCommands() { // Command example
    var connection = connections.find(connection => connection.server.id === server_id); // Finds the connection to the server with the id of server_id
    if (!connection) {
      return console.error('No connection found');
    } else {
      // Send a command to send a message to ATT
      // Examples of getting data from the server
      // Get the player list
      connection.send('player list').then(response => {
        const players = response.data.Result;

        // Cycle through the players and log their names
        for (var i = 0; i < players.length; i++) {
          console.log(players[i].username);
        }
      });
    }
  }
}

main();

// NOTE - to run the file use node index.js in the terminal