
require('dotenv').config();
module.exports={
   myUserConfig:{// Enter if using user credentials 
  username: 'MinerAlex',
  password: process.env.userpassword,
  logVerbosity: 3},// Increase to see debuger logs 

   myBotConfig:{// Enter if using bot credintals 
  clientId: 'XXXXXX',
  clientSecret: 'XXXXXX',
  scope: ['XXXXXX', 'XXXXXX', 'XXXXXX'],
  logVerbosity: 3
}

  
}