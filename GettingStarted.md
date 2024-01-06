# Welcome!!

to make your first bot please [config.js](https://replit.com/@TheRavenSeb/att-client-starter#config.js)

Bot credentials consist of `clientId`, `clientSecret` and `scope`. User credentials consist of `username` and `password`.

```ts
// my-bot-config.js
export const myBotConfig = {
  clientId: 'XXXXXX',
  clientSecret: 'XXXXXX',
  scope: ['XXXXXX', 'XXXXXX', 'XXXXXX']
};
// my-user-config.js
export const myUserConfig = {
  username: 'TheRavenSeb',
  password: 'password'
};
```


## :warning: Storing passwords and client secrets

You should never share your login details or client ID and secret with anyone! If you're building a bot, be mindful of where you store this information, especially if you'll be committing your source code in an online repository. It's generally best practice to store your secrets in [environment variables](https://www.npmjs.com/package/dotenv), and load them from there:

```ts
// my-bot-config.js
export const myBotConfig = {
  clientId: process.env.CLIENT_ID ?? '',
  clientSecret: process.env.CLIENT_SECRET ?? ''
  // the rest of your configuration...
};
```

If you are configuring and storing user credentials, you should additionally be hashing your password. Alta accepts passwords that have been hashed using the SHA512 algorithm and digested hexadecimally.

```sh
# unhashed password
password
# hashed password
b109f3bbbc244eb82441917ed06d618b9008dd09b3befd1b5e07394c706a8bb980b1d7785e5976ec049b46df5f1326af5a2ea6d103fd07c95385ffab0cacbc86
```


(This template was made using examples and documentation from the [Att-Client Github](https://github.com/mdingena/att-client/blob/main))