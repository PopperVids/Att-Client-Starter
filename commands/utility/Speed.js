const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('speed')
		.setDescription('self explanatory'),
	async execute(interaction) {
		// Assuming you have a way to get the player's name in the game, replace 'playerNameInGame' with the actual player's name
		const playerNameInGame = 'MinerAlex'; // Example player name
		const commandToRun = `player modify-stat ${playerNameInGame} speed 4 180`;

		// Here you can execute the command using the commandToRun variable
		// For example, you can use child_process or any other method to run the command

		// Send a message in Discord when the command is executed
		await interaction.reply('Command executed: ' + commandToRun);
	},
};