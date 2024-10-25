const { Client } = require('att-client');
const { Prefab } = require ('att-string-transcoder');

const { myUserConfig } = require('./config');

const bot = new Client(myUserConfig) 
const connections=[]; //array to store connections to servers to access outside of the connect event stream
//--------------------------------------------------------------------------------

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
  await bot.start() //starts the bot

  bot.openServerConnection(server_id) //opens a connection to the server with the id of server_id comment if useing user credentials

  bot.on('connect', connection => { // this event stream will call when the bot connects to the server
    console.log(`Console connection established to ${connection.server.name}.`);
    // Will log every time Client connect to a game server.
    connections.push(connection);//pushes the connection to the connections array to access outside of the event stream

    const WhiteList = [
        '608286242',
        'ID',
        'ID',
        'ID',
        'ID',
        'ID',
        'ID',
        'ID',
        // Add more IDs if needed
      ];

      connection.subscribe('PlayerLeft', async (event) => {
        const LBOZO = event.data.user.username;
  
        if (LBOZO === 'MinerAlex'){
          connection.send('player message * "Bro has left the game" 5');
          console.log('Bro has left the game'); //sends a message to the console onece the command finishes
        }
      
  
      });
  
  
      connection.subscribe('PlayerJoined', async (event) => {
        const { user, mode, position } = event.data;
  
        console.log(`[SERVER] ${user.username}/${user.id} has joined the server`);
        console.log(`[SERVER] ${user.username}/${user.id} joining position: ${position}`);
        console.log(`[SERVER] ${user.username}/${user.id} Joined Mode ${mode}`);
  
        connection.send(`player message * "${user.name}/${user.id} has joined the server" 2`);
  
        if (user === (`MinerAlex`)){
          connection.send(`player message * "PLUH" 6`);
          connection.send(`player modify-stat * damageprotection -9999 5`).then(response => {
          }).catch(error => {
            console.error(`${response.data.Result}`, error);
          })
        }
  
    });
  
      connection.subscribe('PlayerStateChanged', async (event) => {
        if (event.data.user.username.includes('MinerAlex') && event.data.state === 'Dead'){
          connection.send(`player message * "Grrrrr im going to get you" 5`);
        }
  
      });
  
      connection.subscribe('SocialTabletPlayerReported', async (event) => {
        const { ReportedBy, ReportedPlayer, Reason } = event.data;
  
        bot.api.getGroupMember(connection.server.group.id, ReportedBy.id).then(async GroupMember => {
       
          if(Reason.includes('Harrassment') && (GroupMember.permissions.includes("Moderator") || GroupMember.permissions.includes("Owner") && ServerData.tabletCommands)) {
              connection.send(`player message ${ReportedBy.id} "Initializing teleportation." 2`)
                  
              setTimeout(function() {
  
                  connection.send(`player teleport ${ReportedBy.id} ${ReportedPlayer.id}`)
                  connection.send(`player message ${ReportedBy.id} "You have teleported to ${ReportedPlayer.username}." 2`)
  
              }, 3000);
            }
  
            if(Reason.includes('Griefing') && (GroupMember.permissions.includes("Moderator") || GroupMember.permissions.includes("Owner") && ServerData.tabletCommands)) {
              connection.send(`player message ${ReportedBy.id} "To the you know what dungeon." 2`)
          
              setTimeout(function() {
  
                  connection.send(`player set-home ${ReportedPlayer.id} -867.153,573.735,-1715.633`)
                  connection.send(`player teleport ${ReportedPlayer.id} home`)
                  connection.send(`player message ${ReportedPlayer.id} "You have been sent to jail untill futher notice." 4`)
                  connection.send(`player set-home ${ReportedPlayer.id} 0,0,0`)
                  connection.send(`player message ${ReportedBy.id} "You have sent ${ReportedPlayer.username} to the sussy dungeon." 2`)
  
              }, 3000);
            }
  
            if(Reason.includes('CheatingExploits') && (GroupMember.permissions.includes("Moderator") || GroupMember.permissions.includes("Owner") && ServerData.tabletCommands)) {
              connection.send(`player message * "Debug Time." 5`)
  
              setTimeout(function() {
  
                
                
              }, 2000);
            }
          });});
          
  
      connection.subscribe('InventoryChanged', async (event) => {
        const { User } = event.data
        const itemName = event.data.ItemName.toLowerCase();
        const changeType = event.data.ChangeType;
  
        if (itemName.includes('iron key') && changeType === 'Dock') 
          if (WhiteList.includes(`${User.id}`)) {
            connection.send(`player message ${User.id} "yummy" 6`);
            connection.send(`player modify-stat ${User.id} damage 99999 180`);
            connection.send(`player modify-stat ${User.id} damageprotection 31 180`);
            connection.send(`player modify-stat ${User.id} speed 4 180`);
            connection.send(`player set-stat ${User.id} hunger 2`);
        }
        
        if (itemName.includes('candy') && changeType === 'Dock') {
          if (WhiteList.includes(`${User.id}`)) {
          connection.send(`festivities start 9252`);
          }
        }
  
        if (itemName.includes('flower red') && changeType === 'Dock')
          if (WhiteList.includes(`${User.id}`)) {
              connection.send(`player inventory ${User.id}`).then(response => {
              connection.send(`wacky replace ${response.data.Result[0].RightHand['Identifier'] || response.data.Result[0].RightHand['prefabHash']}`)
            }).catch(error => {
              console.error('OH NO ITS ALL OVER MY SCREEN', error);
            })
            console.log(`${User} replaced item`)
          }
  
          let dmessage = '';
          if (itemName.includes(`smelter gem`) && changeType === 'Dock') {
            if (WhiteList.includes(`${User.id}`))
                for (var i in connection.server.players) {
                    let oplayer = connection.server.players[i];
                    dmessage += oplayer.username + "\n"
                }
            connection.send(`player message ${User.id} "${dmessage}" 6`)
            console.log(`player list`);
        }
        
  if (itemName.includes('flower blue') && changeType === 'Dock') {
    if (WhiteList.includes(`${User.id}`)) {
      connection.send(`player detailed ${User.id}`).then(response => {
        const RDR = response.data.Result;
        let resultString = '';
  
        for (let i in RDR) {
          if (i === 'Position') {
            resultString += `${i} ${RDR[i]}\n`;
          }
        }
  
        console.log(resultString);
      }).catch(error => {
        console.error('OH MY GOODNESS', error);
      });
    }
  }
  if (itemName.includes(`CandyCaneKnife`) && changeType === 'Dock') {
    if (WhiteList.includes(`${User.id}`)) {
      const spit = new Prefab('Wyrm_Spit');
  
      spit.setPosition(playerRightHandPosition);
      spit.setRotation(playerRightHandUpInverted);
      spit.setVelocity(playerRightHandUpInvertedMultiplied);
      spit.print();
      const commandResult = await bot.send('...');
  const saveString = commandResult.data.ResultString;
  
  const prefab = Prefab.fromSaveString(saveString);
  prefab.setOnFire();
  
  const newSaveString = prefab.toSaveString();
  
  await bot.send(`spawn string-raw ${newSaveString}`);
    }
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
  if(!connection){return console.error('Ohhhhhh my pluh')


}}}
main()
//NOTE - to run the file use node index.js in the terminal