//For info on documentation see: https://github.com/mdingena/att-client/tree/docs
//Other examples can be found at: https://github.com/mdingena/att-client/tree/main/examples

require('dotenv').config()
const { Client: AttClient } = require('att-client'); //main att client  

//TODO - Review these files for more information on how to get started
// Install the recogmended extensions for better documentation(Ctrl+Shift+X -> Extensions: Install Extensions -> Search for Better Comments & Comment Anchors -> Install)
// LINK GettingStarted.md
// LINK ReadMe.md
/* this is a multi line comment
beepu beepu */

const { myUserConfig } = require('./config'); // Uncomment if the config for bot is alta bot token 

const attClient = new AttClient(myUserConfig);
const connections=[]; //array to store connections to servers to access outside of the connect event stream
//--------------------------------------------------------------------------------
//server Ids
//1717578363 = a testing tale
//1724889222 = A Hot Tale PCVR
//1544126061 = TKATT Not happening

let server_id = 1724889222; //insert server id for the server (only if using user credentials)

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
  await attClient.start() //starts the bot

  attClient.openServerConnection(server_id) //opens a connection to the server with the id of server_id comment if useing user credentials

  attClient.on('connect', connection => { // this event stream will call when the bot connects to the server
    console.log(`Console connection established to ${connection.server.name}.`);
    // Will log every time Client connect to a game server.
    connections.push(connection);//pushes the connection to the connections array to access outside of the event stream

    //! Example of subscribing to a server event stream

    connection.subscribe('PlayerLeft', async (event) => {
      const LBOZO = event.data.user.username;

      if (LBOZO === 'MinerAlex'){
        connection.send('player message * "Bro has left the game" 5');
        console.log('Bro has left the game'); //sends a message to the console onece the command finishes
      }
    

    });


    connection.subscribe('PlayerJoined', async (event) => {
      const WBOZO = event.data.user.username;

      if (WBOZO === 'MinerAlex'){
        connection.send('player message * "Bro has joined the game" 5');
      }

    });

    connection.subscribe('InventoryChanged', async (event) => {
      const itemName = event.data.ItemName.toLowerCase();
      const changeType = event.data.ChangeType;
      const user = event.data.User.username;
      const userId = event.data.User.id;

      if (itemName.includes('iron key') && changeType === 'Pickup') 
        if (user.includes('MinerAlex')) {
          connection.send(`player message ${user} "yummy" 6`);
          connection.send(`player modify-stat ${user} damage 99999 180`);
          connection.send(`player modify-stat ${user} damageprotection 31 180`);
          connection.send(`player modify-stat ${user} speed 8 180`);
          connection.send(`player set-stat ${user} hunger 2`);
      }

      if(itemName.includes('debug') && changeType === 'Pickup')
        if (user.includes('MinerAlex')) {
        connection.send(`Wacky smelter`)
        connection.send(`Wacky chisel-deck`)
        connection.send(`Save wipecaves`)
        connection.send(`wacky ow-loot`)
        connection.send(`wacky destroy-free 61674`)
        connection.send(`wacky destroy-free 61670`)
        connection.send(`wacky destroy-free 24406`)
        connection.send(`wacky destroy-free 43430`)
        connection.send(`wacky destroy-free 5972`)
        connection.send(`wacky destroy-free 7918`)
        connection.send(`wacky destroy-free 18734`)
        connection.send(`player message * "Debug time" 6`)
      }

    }

    // LINK subscriptionreturns.txt
    // for more information on the event stream
    );
    runcommands()//runs the commands function




  });

  function runcommands(){//command example 

  var connection = connections.find(connection => connection.server.id === server_id); //finds the connection to the server with the id of server_id 
  // Not important for if using user credentials just use the connect stream to access the connection ^^^
if(!connection){return console.error('No connection found')


} else{//if no connection is found log an error
  // Send a command to send a message to att
     // all commands admins can send bots can too!!



  // Examples of getting data from the server 


  // Get the player list
  connection.send('player list').then(response => {
    const players = response.data.Result;

    //cycle through the players and log their names
    for(var i = 0; i < players.length; i++){
      console.log(players[i].username)
    }
  });}}




}
main()

const fs = require('node:fs');
const path = require('node:path');
const { Client, Collection, Events, GatewayIntentBits } = require('discord.js');
const token = process.env.TOKEN;

const DiscordClient = new Client({ intents: [
  GatewayIntentBits.Guilds,
  GatewayIntentBits.GuildMembers,
  GatewayIntentBits.GuildMessages,
  GatewayIntentBits.MessageContent,
] });

DiscordClient.commands = new Collection();
const foldersPath = path.join(__dirname, 'commands');
const commandFolders = fs.readdirSync(foldersPath);

for (const folder of commandFolders) {
	const commandsPath = path.join(foldersPath, folder);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		if ('data' in command && 'execute' in command) {
			DiscordClient.commands.set(command.data.name, command);
		} else {
			console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
		}
	}
}

DiscordClient.once(Events.ClientReady, readyClient => {
	console.log(`Logged in as ${readyClient.user.tag}`);
});

DiscordClient.on(Events.InteractionCreate, async interaction => {
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
			await interaction.followUp({ content: 'There was an error while executing this command!', ephemeral: true });
		} else {
			await interaction.reply({ content: 'There was an error while executing this command!', ephemeral: true });
		}
	}
});

DiscordClient.login(token);