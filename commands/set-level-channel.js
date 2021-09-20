const customChannelSchema = require('../schemas/custom-channel-schema')

module.exports = {
    name: "setchannel",
    desciption: "Say something",

    async execute(client, message, cmd, args) {

        if (!message.member.hasPermission("ADMINISTRATOR")) return message.channel.send("You don't have enough permission to use this command");
        if (!message.guild.me.hasPermission("MANAGE_ROLES")) return message.channel.send("I don't have enough permission to make this");

        let channelSelected = args[0].replace('#', '')
        let channelSelected2 = channelSelected.replace('<', '')
        let channelSelected3 = channelSelected2.replace('>', '')
       
        if (!channelSelected3) return message.channel.send('Please provide something');
        if (isNaN(channelSelected3)) return message.channel.send('Please provide a valid channel');
        if (channelSelected3.length < 18) return message.channel.send('Please provide a valid channel');
        if (channelSelected3.length > 20) return message.channel.send('Please provide a valid channel');
        var customMessage = args.slice(1).join(" ");
        if (!customMessage) return message.channel.send('Please provide a custom message');
        if (customMessage.length > 200) return message.channel.send('Please provide a shorter custom message');
        if (!client.channels.cache.get(channelSelected3)) return message.channel.send("That channel doesn't exist");
        const selectedChannel = client.channels.cache.find(channel => channel.id === channelSelected3);
        if (!message.guild.me.permissionsIn(selectedChannel).has('SEND_MESSAGES')) return message.channel.send("I can't send messages to that channel");
        selectedChannel.send('This channel will be used to send the level up messages');
        

        await customChannelSchema.findOneAndUpdate(
            {
                guildId: message.guild.id
            },
            {
                guildId: message.guild.id,
                channelId: channelSelected3,
                customMessage
            },
            {
                upsert: true
            }
        )
        
        message.channel.send(`Custom message settled in <#${channelSelected3}>`)

    }
}