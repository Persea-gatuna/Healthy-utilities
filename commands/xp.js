const Discord = require('discord.js');
const userProfile = require('../models/userProfile.js');
const moment = require('moment');

module.exports = {
    name: "xp",
    aliases: ["level", "lvl"],
    execute: async (message, args) => {

        var result;

        if (!args[0] || !message.mentions.members.first() || !message.guild.members.cache.get(args[0])) {
            result = await userProfile.findOne({ userId: message.author.id });
        }

        if (message.mentions.members.first() || message.guild.members.cache.get(args[0])) {
            var member = message.mentions.members.first() || message.guild.members.cache.get(args[0])
            result = await userProfile.findOne({ userId: member.user.id });
        }

        levelXP = [10, 50, 100, 300, 500];

            if (result) {
                if (result.xp < 10) {
                    var currentXp = result.xp;
                    var levelXPLeft = levelXP[0] - result.xp;
                    var nextLevel = 0;
                    var levelName = 'Big activist';
                }
                if (result.xp >= 10 && result.xp < 50) {
                    var currentXp = result.xp;
                    var levelXPLeft = levelXP[1] - result.xp;
                    var nextLevel = 1;
                    var levelName = 'Epic activist';
                }
                if (result.xp >= 50 && result.xp < 100) {
                    var currentXp = result.xp;
                    var levelXPLeft = levelXP[2] - result.xp;
                    var nextLevel = 2;
                    var levelName = 'Legendary activist';
                }
                if (result.xp >= 100 && result.xp < 300) {
                    var currentXp = result.xp;
                    var levelXPLeft = levelXP[3] - result.xp;
                    var nextLevel = 3;
                    var levelName = 'Insane activist';
                }
                if (result.xp >= 300 && result.xp < 500) {
                    var currentXp = result.xp;
                    var levelXPLeft = levelXP[4] - result.xp;
                    var nextLevel = 4;
                    var levelName = 'Heroic activist';
                }
                if (result.xp > 500) {
                    var currentXp = result.xp;
                    var levelXPLeft = 0;
                    var nextLevel = 4;
                    var levelName = 'Heroic activist';
                }
            } else {
                await new userProfile({
                    _id: mongoose.Types.ObjectId(),
                    userId: member.user.id,
                    points: 0,
                    xp: 0
                }).save();

                var currentXp = 0;
                var levelXPLeft = 10;
                var levelName = 'Big activist';
            }

            const embed = new Discord.MessageEmbed()
            .setTitle(`${message.author.username}`)
            .addField(`Current XP: ${currentXp}`, `${levelXPLeft} XP until next level (${levelName})`)
            .setColor('00FF11')
            .setFooter(moment.utc().format('MMM Do YYYY HH:mm'));

            message.channel.send(embed);
    },
};