const mongoose = require('mongoose');
const userProfile = require('../models/userProfile.js');

module.exports = {
    name: 'add',
    execute: async (message, args) => {

        if (!message.member.permissions.has('ADMINISTRATOR')) return;

        if (!args[0] || !args[1]) return message.channel.send('Usage: `+add [@User / ID] [Amount]`');

        if (isNaN(args[1]) || Math.floor(args[1]) != args[1]) return message.channel.send('Please enter a valid amount');

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) return message.channel.send('Please enter a valid member');

        const result = await userProfile.findOne({ userId: member.user.id });

        if (result) {

            await userProfile.findOneAndReplace({ userId: member.user.id }, { userId: member.user.id, xp: result.xp, points: result.points + Math.floor(args[1]), messageCount: result.messageCount }, null, function (err, docs) { 
				if (err) return console.log(err) 
			});

            message.channel.send(`Added ${Math.floor(args[1])} points to <@${member.user.id}>`);
        } else {
            await new userProfile({
				_id: mongoose.Types.ObjectId(),
				userId: member.user.id,
                points: Math.floor(args[1]),
				xp: 0
			}).save();

            message.channel.send(`Added ${Math.floor(args[1])} points to <@${member.user.id}>`);
        }

    },
};