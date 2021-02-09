const Discord = require('discord.js');
const userProfile = require('../models/userProfile.js');
const moment = require('moment');

module.exports = {
    name: "bal",
    aliases: ["points", "balance"],
    execute: async (message, args) => {

        if (!args[0] || !message.mentions.members.first() || !message.guild.members.cache.get(args[0])) {
            var result = await userProfile.findOne({ userId: message.author.id });
        }

        if (message.mentions.members.first() || message.guild.members.cache.get(args[0])) {
            var member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
            var result = await userProfile.findOne({ userId: member.user.id });
        }

            if (result) {
                var currentPoints = result.points;


            } else {
                await new userProfile({
                    _id: mongoose.Types.ObjectId(),
                    userId: member.user.id,
                    points: 0,
                    xp: 0
                }).save();

                var currentPoints = 0;

            }

            const embed = new Discord.MessageEmbed()
            .setTitle(`${message.author.username}`)
            .setDescription(`**Current points: ${currentPoints}**`)
            .setColor('00FF11')
            .setFooter(moment.utc().format('MMM Do YYYY HH:mm'));

            message.channel.send(embed);
    },
};