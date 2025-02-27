const { Client } = require('att-client');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const { myUserConfig } = require('./config');

const bot = new Client(myUserConfig) 
const connections=[]; //array to store connections to servers to access outside of the connect event stream
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
  await bot.start() //starts the bot

  rl.question('Please enter the server ID: ', (server_id) => {
    const numericServerId = Number(server_id); // Convert server_id to a number

    bot.openServerConnection(numericServerId).then(() => {
      console.log(`Attempting to connect to server with ID: ${numericServerId}`);
    }).catch((error) => {
      console.error('Failed to open server connection:', error);
    });

    rl.close();
  });

  bot.on('connect', connection => { // this event stream will call when the bot connects to the server
    console.log(`Console connection established to ${connection.server.name}.`);
    // Will log every time Client connect to a game server.
    connections.push(connection);//pushes the connection to the connections array to access outside of the event stream
    runcommands(connection.server.id);

    connection.send(`player message MinerAlex "Bot is online" 6`)

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

    connection.subscribe("InventoryChanged", async (event) => {
      const changeType = event.data.ChangeType;
      const itemName = event.data.ItemName.toLowerCase();
    
      function distanceFormula3D(x1, y1, z1, x2, y2, z2) {
        return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));
      }
    
      if (changeType.includes('Pickup') && itemName === '') {
        connection.send(`player inventory MinerAlex`).then((resp) => {
          var rightHandItem = resp.data.Result[0].RightHand;
          var leftHandItem = resp.data.Result[0].LeftHand;
    
          if (rightHandItem && rightHandItem['Name'].includes('Friend')) {
            connection.send(`player detailed MinerAlex`).then((resp) => {
              try {
                const result = resp.data.Result;
                const leftHand = result.LeftHandPosition;
                const rightHand = result.RightHandPosition;
                const head = result.HeadPosition;
    
                console.log(result.HeadPosition);
    
                if (leftHand && rightHand) { // Ensure leftHand and rightHand positions exist
                  const headRight = distanceFormula3D(rightHand[0], rightHand[1], rightHand[2], head[0], head[1], head[2]);
                  const headLeft = distanceFormula3D(leftHand[0], leftHand[1], leftHand[2], head[0], head[1], head[2]);
    
                  if (headRight <= 0.40 || headLeft <= 0.40) {
                    connection.send(`player message MinerAlex 'Domain expansion' 3`);
                    connection.send(`player list-detailed`).then((response) => {
                      console.log("Player list-detailed response received:", response);
    
                      if (response && response.data && response.data.Result) {
                        const playersList = response.data.Result;
    
                        playersList.forEach((player, index) => {
                          console.log(`Player ${index + 1}:`, player);
                        });
    
                        const players = playersList.map(player => {
                          return {
                            id: player.id,
                            username: player.username,
                            position: player.Position
                          };
                        });
    
                        console.log("Detailed player info:", players);
    
                        const me = players.find(player => player.username === 'MinerAlex'); // Replace 'MinerAlex' with your actual username
    
                        if (me) {
                          const myPos = me.position;
                          if (!myPos) {
                            connection.send(`player message MinerAlex "Could not retrieve your position data." 6`);
                            return;
                          }
    
                          const distanceFormula3D = (x1, y1, z1, x2, y2, z2) => {
                            return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));
                          };
    
                          const distances = players
                            .filter(player => player.username !== me.username && player.position)
                            .map(player => ({
                              player: player,
                              distance: distanceFormula3D(myPos[0], myPos[1], myPos[2], player.position[0], player.position[1], player.position[2])
                            }));
    
                          distances.sort((a, b) => a.distance - b.distance);
    
                          const closestPlayers = distances.slice(0, 3).map(d => d.player);
    
                          closestPlayers.forEach(player => {
                            connection.send(`player message ${player.username} "Domain Expansion" 6`);
                            connection.send(`player modify-stat ${player.username} nightmare 20 20`);
                            console.log(`${player.username}`);
                          });
                        } else {
                          connection.send(`player message MinerAlex "Your details could not be found." 6`);
                        }
                      } else {
                        connection.send(`player message MinerAlex "Could not retrieve player list." 6`);
                      }
                    }).catch((error) => {
                      console.error("Error fetching player list-detailed:", error);
                      connection.send(`player message MinerAlex "An error occurred while fetching player list-detailed." 6`);
                    });
                  }
                } else {
                  console.error('LeftHand or RightHand position is undefined');
                }
              } catch (error) {
                console.error('An error occurred:', error);
              }
            }).catch((error) => {
              console.error('Failed to fetch player details:', error);
            });
          }
        });
      }
    });       

    connection.subscribe("CommandExecuted", async (event) => { 
      // CommandExecuted will be used for voice commands
      var pluhCOMMAND = event.data.Command;
      const me = "MinerAlex";
      const Lag = "1862806585";
      const Foxy = "290391797";
    
      if (pluhCOMMAND === "buff") {
        connection.send(`player modify-stat ${me} speed 7 999999999`);
        connection.send(`player modify-stat ${me} damage protection 9999 999999999`);
        connection.send(`player modify-stat ${me} damage 9999 999999999`);
        console.log(`PLUH`);
      }
    
      if (pluhCOMMAND === "ghost") {
        connection.send(`settings changesetting server downedStateDuration 60`);
        connection.send(`player modify-stat ${me} DamageProtection 100 99999999`);
        connection.send(`player kill ${me}`);
        connection.send(`settings changesetting server downedStateDuration 0`);
      }
    
      if (pluhCOMMAND === "up") {
        connection.send(`player detailed ${me}`).then((response) => {
          const POS = response.data.Result.Position;
          const x = POS[0];
          const y = POS[1] += 3;
          const z = POS[2];
    
          connection.send(`player set-home ${me} ${x},${y},${z}`);
          connection.send(`player teleport ${me} home`);
          connection.send(`player set-home ${me} 0,0,0`);
        }).catch((error) => {
          console.error("This is so not pluh:", error);
        });
      }
    
      if (pluhCOMMAND === "down") {
        connection.send(`player detailed ${me}`).then((response) => {
          const POS = response.data.Result.Position;
          const x = POS[0];
          const y = POS[1] -= 3;
          const z = POS[2];
    
          connection.send(`player set-home ${me} ${x},${y},${z}`);
          connection.send(`player teleport ${me} home`);
          connection.send(`player set-home ${me} 0,0,0`);
        }).catch((error) => {
          console.error("This is so not pluh:", error);
        });
      }
    
      if (pluhCOMMAND === "kill") {
        connection.send(`player kill ${me}`);
      }
    
      if (pluhCOMMAND === "forwards") {
        connection.send(`player teleport ${me} ${me}`);
      }
    
      if (pluhCOMMAND === "lag") {
        connection.send(`player detailed ${Lag}`).then((response) => {
          const POS = response.data.Result.Position;
          const x = POS[0];
          const y = POS[1] += 50;
          const z = POS[2];
    
          connection.send(`player set-home ${Lag} ${x},${y},${z}`);
          connection.send(`player teleport ${Lag} home`);
          connection.send(`player set-home ${Lag} 0,0,0`);
        }).catch((error) => {
          console.error("This is so not pluh:", error);
        });
      }
    
      if (pluhCOMMAND === "table") {
        connection.send(`spawn ${me} TablePlacer 10`);
      }
    
      if (pluhCOMMAND === "fling") {
        connection.send(`player detailed ${me}`).then((response) => {
          const POS = response.data.Result.Position;
          const x = POS[0];
          const y = POS[1] += 50;
          const z = POS[2];
    
          connection.send(`player set-home ${me} ${x},${y},${z}`);
          connection.send(`player teleport ${me} home`);
          connection.send(`player set-home ${me} 0,0,0`);
        }).catch((error) => {
          console.error("This is so not pluh:", error);
        });
      }
    
      if (pluhCOMMAND === "lemon") {
        connection.send(`player teleport ${me} Lemon.`);
      }

      if (pluhCOMMAND === "blah") {
        connection.send(`player list-detailed`).then((response) => {
          console.log("Player list-detailed response received:", response);
      
          if (response && response.data && response.data.Result) {
            const playersList = response.data.Result; // List of all players with their details
      
            // Log each player object in the list
            playersList.forEach((player, index) => {
              console.log(`Player ${index + 1}:`, player);
            });
      
            // Extract and process detailed player info
            const players = playersList.map(player => {
              return {
                id: player.id,
                username: player.username,
                position: player.Position // Correctly accessing the position data
              };
            });
      
            console.log("Detailed player info:", players);
      
            // Identify "me" by username or ID
            const me = players.find(player => player.username === 'MinerAlex'); // Replace 'MinerAlex' with your actual username
      
            if (me) {
              const myPos = me.position;
              if (!myPos) {
                connection.send(`player message MinerAlex "Could not retrieve your position data." 6`);
                return;
              }
      
              const myX = myPos[0];
              const myY = myPos[1];
              const myZ = myPos[2];
      
              // Function to calculate Euclidean distance in 3D
              const distanceFormula3D = (x1, y1, z1, x2, y2, z2) => {
                return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));
              };
      
              let closestPlayer = null;
              let closestDistance = Infinity;
      
              players.forEach(player => {
                if (player.username !== me.username && player.position) {
                  const playerPos = player.position;
                  const distance = distanceFormula3D(myPos[0], myPos[1], myPos[2], playerPos[0], playerPos[1], playerPos[2]);
      
                  if (distance < closestDistance) {
                    closestDistance = distance;
                    closestPlayer = player;
                  }
                }
              });
      
              if (closestPlayer) {
                connection.send(`player message ${me.username} "The closest player to you is ${closestPlayer.username} at position ${closestPlayer.position[0]}, ${closestPlayer.position[1]}, ${closestPlayer.position[2]}" 6`);
                connection.send(`player message ${closestPlayer.username} "you are mine now" 90`);
                let i = 0;
                (function loop() {
                  setTimeout(() => {
                    if (i < 30) {
                      connection.send(`player teleport ${closestPlayer.username} ${me.username}`);
                      i++;
                      loop();
                    }
                  }, 3000);
                })();
              } else {
                connection.send(`player message ${me.username} "No other players found." 6`);
              }
            } else {
              connection.send(`player message MinerAlex "Your details could not be found." 6`);
            }
          } else {
            connection.send(`player message MinerAlex "Could not retrieve player list." 6`);
          }
        }).catch((error) => {
          console.error("Error fetching player list-detailed:", error);
          connection.send(`player message MinerAlex "An error occurred while fetching player list-detailed." 6`);
        });
      }
      
      if (pluhCOMMAND === "Domain") {
        connection.send(`player list-detailed`).then((response) => {
          console.log("Player list-detailed response received:", response);
      
          if (response && response.data && response.data.Result) {
            const playersList = response.data.Result;
      
            playersList.forEach((player, index) => {
              console.log(`Player ${index + 1}:`, player);
            });
      
            const players = playersList.map(player => {
              return {
                id: player.id,
                username: player.username,
                position: player.Position
              };
            });
      
            console.log("Detailed player info:", players);
      
            const me = players.find(player => player.username === 'MinerAlex'); // Replace 'MinerAlex' with your actual username
      
            if (me) {
              const myPos = me.position;
              if (!myPos) {
                connection.send(`player message MinerAlex "Could not retrieve your position data." 6`);
                return;
              }
      
              const distanceFormula3D = (x1, y1, z1, x2, y2, z2) => {
                return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2) + Math.pow(z2 - z1, 2));
              };
      
              const distances = players
                .filter(player => player.username !== me.username && player.position)
                .map(player => ({
                  player: player,
                  distance: distanceFormula3D(myPos[0], myPos[1], myPos[2], player.position[0], player.position[1], player.position[2])
                }));
      
              distances.sort((a, b) => a.distance - b.distance);
      
              const closestPlayers = distances.slice(0, 3).map(d => d.player);
      
              closestPlayers.forEach(player => {
                connection.send(`player message ${me.username} "The closest player to you is ${player.username} at position ${player.position[0]}, ${player.position[1]}, ${player.position[2]}" 6`);
                connection.send(`player modify-stat ${player.username} speed 7 10`); // Grants speed for 60 seconds at level 2 (index 1)
              });
            } else {
              connection.send(`player message MinerAlex "Your details could not be found." 6`);
            }
          } else {
            connection.send(`player message MinerAlex "Could not retrieve player list." 6`);
          }
        }).catch((error) => {
          console.error("Error fetching player list-detailed:", error);
          connection.send(`player message MinerAlex "An error occurred while fetching player list-detailed." 6`);
        });
      }
      
      if (pluhCOMMAND === "Hands") {
        connection.send(`player detailed MinerAlex`).then((response) => {
          console.log("Player detailed response received:", response);
      
          if (response && response.data && response.data.Result) {
            const playerData = response.data.Result;
            const rightHandPos = playerData.RightHandPosition;
      
            if (rightHandPos) {
              connection.send(`player message MinerAlex "Your right hand position is ${rightHandPos[0]}, ${rightHandPos[1]}, ${rightHandPos[2]}" 6`);
            } else {
              connection.send(`player message MinerAlex "One or more position data points are missing." 6`);
            }
          } else {
            connection.send(`player message MinerAlex "Could not retrieve detailed player data." 6`);
          }
        }).catch((error) => {
          console.error("Error fetching detailed player data:", error);
          connection.send(`player message MinerAlex "An error occurred while fetching detailed player data." 6`);
        });
      }          
}
    );});

  function runcommands(server_id) {
    // Convert server_id to a number to ensure consistent comparison
    const numericServerId = Number(server_id);

    // Debugging output to verify types and values
    console.log(`Looking for connection with server ID: ${numericServerId}`);
    connections.forEach(conn => {
      console.log(`Available connection server ID: ${conn.server.id}`);
    });

    // Find the connection with the matching server ID
    const connection = connections.find(connection => connection.server.id === numericServerId);

    if (!connection) {
      return console.error('Ohhhhhh my pluh');

}}}
main()