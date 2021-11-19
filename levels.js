const profileSchema = require('./schemas/profile-schema');
const customChannelSchema = require('./schemas/custom-channel-schema');
const rolesSchema = require('./schemas/roles-schema');

module.exports = (client) => {
    client.on('message', (message) => {
        const { guild, member } = message
        if (message.author.bot) return;
        addXP(guild.id, member.id, 23, message)
    });
}

const getNeededXP = (level) => level * level * 100;

const main = require('./main');

const addXP = async (guildId, userId, xpToAdd, message) => {
    const result = await profileSchema.findOneAndUpdate(
        {
            guildId,
            userId,
        },
        {
            guildId,
            userId,
            username: message.author.username,
            avatar: message.author.displayAvatarURL(),
            $inc: {
                xp: xpToAdd,
            },
        },
        {
            upsert: true,
            new: true,
        }
    );

    let { xp, level } = result;
    const needed = getNeededXP(level);

    if (xp >= needed) {

        let level2 = level;

        ++level;
        xp -= needed;

        if (level >= 100) return;

        const roleResult = await rolesSchema.findOne(
            {
                guildId: message.guild.id,
                level
            }
        ).catch(err => message.channel.send('There was an error'));

        if (roleResult) {
            if (!message.member.roles.cache.has(roleResult.roleId)) {
                await message.member.roles.add(roleResult.roleId);
            }
            const roleResult2 = await rolesSchema.findOne(
                {
                    guildId: message.guild.id,
                    level: level2
                }
            ).catch(err => message.channel.send('There was an error'));

            if (roleResult2) {
                if (message.member.roles.cache.has(roleResult2.roleId)) {
                    await message.member.roles.remove(roleResult2.roleId);
                }
            }
        }

        const customResult = await customChannelSchema.findOne({
            guildId
        });

        if (!customResult) {
            message.channel.send(`Congrats ${message.author} for leveling up to level ${level} with ${xp} xp!`)
        } else {
            let customMessage = await customResult.customMessage.replace('${level}', `${level}`);
            const selectedChannel = main.clientDiscord.channels.cache.find(channel => channel.id === customResult.channelId);
            let customMessage2 = await customMessage.replace('${xp}', `${xp}`);
            let customMessage3 = await customMessage2.replace('${user}', message.author);
            selectedChannel.send(customMessage3);
        } 

        await profileSchema.updateOne(
            {
                guildId,
                userId,
            },
            {
                level,
                xp,
            }
        );
    }
}

module.exports.addXP = addXP;