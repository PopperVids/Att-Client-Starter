//For info on documentation see: https://github.com/mdingena/att-client/tree/docs
//Other examples can be found at: https://github.com/mdingena/att-client/tree/main/examples

require('dotenv').config()
const { Client } = require('att-client'); //main att client  

//TODO - Review these files for more information on how to get started
// Install the recogmended extensions for better documentation(Ctrl+Shift+X -> Extensions: Install Extensions -> Search for Better Comments & Comment Anchors -> Install)
// LINK GettingStarted.md
// LINK ReadMe.md
/* this is a multi line comment
beepu beepu */

const { myUserConfig } = require('./config'); // Uncomment if the config for bot is alta bot token 
//const { myBotConfig } = require('./config'); // Uncomment if the config for bot is alta user credentials 

// create a client object using config
//const bot = new Client(myBotConfig) //uncomment if using bot credentials

const bot = new Client(myUserConfig) // uncomment if useing user credentials 
const connections=[]; //array to store connections to servers to access outside of the connect event stream
//--------------------------------------------------------------------------------
//server Ids
//1717578363 = a testing tale
//1724889222 = A Hot Tale PCVR
//1544126061 = TKATT Not happening

let server_id = 1717578363; //insert server id for the server (only if using user credentials)

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
  await bot.start() //starts the bot

  bot.openServerConnection(server_id) //opens a connection to the server with the id of server_id comment if useing user credentials

  bot.on('connect', connection => { // this event stream will call when the bot connects to the server
    console.log(`Console connection established to ${connection.server.name}.`);
    // Will log every time Client connect to a game server.
    connections.push(connection);//pushes the connection to the connections array to access outside of the event stream

    //! Example of subscribing to a server event stream

    connection.subscribe('PlayerStateChanged', (event) => {
      const NotNice = event.data.user.username;

      if(NotNice === 'MinerAlex'){ //Checks if the player that enterd combat is MinerAlex
       connection.send('player modify-stat 608286242 speed 7 180')
       connection.send('player modify-stat 608286242 damage 99999 180')
       connection.send('player modify-stat 608286242 DamageProtection 15 180')
       connection.send('player set-stat 608286242 hunger 2')
       connection.send('player message MinerAlex "get buffed" 5') //sends a message to the console onece the command finishes
       connection.send('player message * "Grrrrrrrrrrrrrrrrr" 10')
       console.log('Bro has been buffed')
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
//NOTE - to run the file use node index.js in the terminal// NOTE - to run the file use node index.js in the terminal