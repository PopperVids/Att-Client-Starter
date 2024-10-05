
require('dotenv').config();
module.exports={
   myUserConfig:{// Enter if using user credentials 
  username: 'MinerAlex',
  password: process.env.userpassword,
  logVerbosity: 3},// Increase to see debuger logs 

   myBotConfig:{// Enter if using bot credintals 
  clientId: process.env.ClientID,
  clientSecret: process.env.ClientSecret,
  scope: [ 'ws.group', 'ws.group_members', 'ws.group_servers', 'ws.group_bans', 'ws.group_invites', 'group.info', 'group.join', 'group.leave', 'group.view', 'group.members', 'group.invite', 'server.view', 'server.console'],
  logVerbosity: 3
   }

  
}