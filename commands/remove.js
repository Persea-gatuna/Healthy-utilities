const mongoose = require('mongoose');
const userProfile = require('../models/userProfile.js');

module.exports = {
    name: 'remove',
    execute: async (message, args) => {

        if (!message.member.permissions.has('ADMINISTRATOR')) return;

        if (!args[0] || !args[1]) return message.channel.send('Usage: `+remove [@User / ID] [Amount]`');

        if (isNaN(args[1]) || Math.floor(args[1]) != args[1]) return message.channel.send('Please enter a valid amount');

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) return message.channel.send('Please enter a valid member');

        const result = await userProfile.findOne({ userId: member.user.id });

        if (!result || result.xp == 0) return message.channel.send("That person doesn't have any points!");

        if (result.points - Math.floor(args[1]) <= 0) {
            const newPoints = 0;
        } else {
            const newPoints = result.points - Math.floor(args[1]);
        }

        await userProfile.findOneAndReplace({ userId: member.user.id }, { userId: member.user.id, xp: result.xp, points: newPoints - Math.floor(args[1]), messageCount: result.messageCount }, null, function (err, docs) { 
			if (err) return console.log(err) 
		});

        message.channel.send(`Removed ${Math.floor(args[1])} 🌱 from <@${member.user.id}>`);
    },
};