const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('speed')
		.setDescription('self explanatory'),
	async execute(interaction) {
		await interaction.reply('NUH UH');
	},
};