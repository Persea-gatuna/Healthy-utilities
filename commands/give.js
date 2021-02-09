const mongoose = require('mongoose');
const userProfile = require('../models/userProfile.js');

module.exports = {
    name: 'give',
    execute: async (message, args) => {
        if (!args[0] || !args[1]) return message.channel.send('Usage: `+give [@User / ID] [Amount]`');

        if (isNaN(args[1]) || Math.floor(args[1]) != args[1]) return message.channel.send('Please enter a valid amount');

        const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]);
        if (!member) return message.channel.send('Please enter a valid member');

        const result = await userProfile.findOne({ userId: member.user.id });
        const authorResult = await userProfile.findOne({ userId: message.member.user.id });

        if (!authorResult || authorResult.xp - Math.floor(args[1]) < 0) return message.channel.send("❌ You don't have enough points");

        if (result) {
            await userProfile.findOneAndReplace({ userId: member.user.id }, { userId: member.user.id, points: result.points + Math.floor(args[1]), xp: result.xp, messageCount: result.messageCount }, null, function (err, docs) { 
				if (err) return console.log(err) 
			})

            await userProfile.findOneAndReplace({ userId: message.author.id }, { userId: message.author.id, points: authorResult.points - Math.floor(args[1]), xp: authorResult.xp, messageCount: authorResult.messageCount });
        } else {
            await new userProfile({
				_id: mongoose.Types.ObjectId(),
				userId: member.user.id,
                points: Math.floor(args[1]),
				xp: 0
			}).save();

            await userProfile.findOneAndReplace({ userId: message.author.id }, { userId: message.author.id, points: authorResult.points - Math.floor(args[1]), xp: authorResult.xp, messageCount: authorResult.messageCount });
        }

        
        message.channel.send(`<@${message.author.id}> gave ${Math.floor(args[1])} points to <@${member.user.id}>`);
    },
};