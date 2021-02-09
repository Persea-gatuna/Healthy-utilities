const Discord = require('discord.js');
const fs = require('fs');
const prefix = '+';
const config = require('./config.json');
const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/healthy-utilities',
{ useNewUrlParser: true,
useUnifiedTopology: true,
useFindAndModify: false,
useCreateIndex: true });

const userProfile = require('./models/userProfile.js');

const client = new Discord.Client({ ws: { intents: ['GUILD_MEMBERS', 'GUILDS', 'GUILD_MESSAGES'] } });
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

client.once('ready', () => {
	console.log('Healthy Utilities is ON!');
	client.user.setPresence({
		activity: {
			name: '+help 🌱',
		},
		status: 'online',
	})
		.catch(console.error);
});
client.login(config.token);

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.name, command);
}

function randomNumber(min, max) {
  return Math.random() * (max - min) + min; 
}

client.on('message', async message => {

	if (message.author.bot) return;

  	if (message.guild) {

    	let result = await userProfile.findOne({ userId: message.author.id });

		let xp = 0;

		if (result) {
			xp = result.xp;
		
			var messageCount = result.messageCount + 1;

			await userProfile.findOneAndReplace({ userId: message.author.id }, { userId: message.author.id, messageCount: messageCount, xp: xp, points: result.points }, null, function (err, docs) { 
				if (err) { 
					console.log(err) 
				};
			});

		} else {
			await new userProfile({
				_id: mongoose.Types.ObjectId(),
				userId: message.author.id,
				points: 0,
				xp: xp,
				messageCount: 1
			}).save();
		}

		let levelMessages = await userProfile.findOne({ userId: message.author.id, messageCount: messageCount });

		if (levelMessages && levelMessages.messageCount >=10) {
			await userProfile.findOneAndReplace({ userId: message.author.id }, { userId: message.author.id, xp: result.xp + 1, points: result.points, messageCount: 0 }, null, function (err, docs) { 
				if (err) { 
					console.log(err) 
				};
			});
		}

		if (result) {
			if (result.xp >= 10 && result.xp < 50) {
				if (!message.member.roles.cache.get('806853850153222165')) {
				message.member.roles.add(message.guild.roles.cache.get('806853850153222165'));
				await userProfile.findOneAndReplace({ userId: message.author.id }, { userId: message.author.id, xp: result.xp, points: result.points + Math.floor(Math.random() * (10 + 1 - 1)) + 1, messageCount: 0 }, null, function (err, docs) { 
					if (err) { 
						console.log(err) 
					};
				});
				message.author.send('You have been given the role `Big activist` in Healthy Environment!');
				}
			}
			if (result.xp >= 50 && result.xp < 100) {
				if (!message.member.roles.cache.get('808562710383558677')) {
				message.member.roles.add(message.guild.roles.cache.get('808562710383558677'));
				await userProfile.findOneAndReplace({ userId: message.author.id }, { userId: message.author.id, xp: result.xp, points: result.points + Math.floor(Math.random() * (10 + 1 - 1)) + 1, messageCount: 0 }, null, function (err, docs) { 
					if (err) { 
						console.log(err) 
					};
				});
				message.author.send('You have been given the role `Epic activist` in Healthy Environment!');
				}
			}
			if (result.xp >= 100 && result.xp < 300) {
				console.log('x')
				if (!message.member.roles.cache.get('808562725063229450')) {
				message.member.roles.add(message.guild.roles.cache.get('808562725063229450'));
				await userProfile.findOneAndReplace({ userId: message.author.id }, { userId: message.author.id, xp: result.xp, points: result.points + Math.floor(Math.random() * (10 + 1 - 1)) + 1, messageCount: 0 }, null, function (err, docs) { 
					if (err) { 
						console.log(err) 
					};
				});
				message.author.send('You have been given the role `Legendary activist` in Healthy Environment!');
				}
			}
			if (result.xp >= 300 && result.xp < 500) {
				if (!message.member.roles.cache.get('808562740066517023')) {
				message.member.roles.add(message.guild.roles.cache.get('808562740066517023'));
				await userProfile.findOneAndReplace({ userId: message.author.id }, { userId: message.author.id, xp: result.xp, points: result.points + Math.floor(Math.random() * (10 + 1 - 1)) + 1, messageCount: 0 }, null, function (err, docs) { 
					if (err) { 
						console.log(err) 
					};
				});
				message.author.send('You have been given the role `Insane activist` in Healthy Environment!');
				}
			}
			if (result.xp >= 500) {
				if (!message.member.roles.cache.get('808562752963870772')) {
				message.member.roles.add(message.guild.roles.cache.get('808562752963870772'));
				await userProfile.findOneAndReplace({ userId: message.author.id }, { userId: message.author.id, xp: result.xp, points: result.points + Math.floor(Math.random() * (10 + 1 - 1)) + 1, messageCount: 0 }, null, function (err, docs) { 
					if (err) { 
						console.log(err) 
					};
				});
				message.author.send('You have been given the role `Heroic activist` in Healthy Environment!');
				}
			}
		}

	}

	if (!message.content.startsWith(prefix)) return;

	message.guild.members.fetch();

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();

	const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
	if (!command) return;

	try {
		command.execute(message, args, client);
	} catch (err) {
		console.log(err);
		message.reply('❌ An error ocurred while trying to run that command.');
	}

});