const customChannelSchema = require('../schemas/custom-channel-schema')

module.exports = {
    name: "say",
    aliases: ['botsays'],
    desciption: "Say something",

    async execute (client, message, cmd, args) {

        const customResult = await customChannelSchema.findOne({
            guildId: message.guild.id
        })

        message.channel.send(customResult.channelId)
    }
}