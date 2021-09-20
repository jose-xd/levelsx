const rolesSchema = require('../schemas/roles-schema')

module.exports = {
    name: "setrewards",
    desciption: "Set rewards",

    async execute(client, message, cmd, args) {
        
        if (!args[1]) return message.channel.send("Please put something")

        let roleSelected = args[1].replace('@&', '')
        let roleSelected2 = roleSelected.replace('<', '')
        let roleSelected3 = roleSelected2.replace('>', '')

        if (!roleSelected3) return message.channel.send('Please provide something');
        if (isNaN(roleSelected3)) return message.channel.send('Please provide a valid role');
        if (roleSelected3.length < 18) return message.channel.send('Please provide a valid role');
        if (roleSelected3.length > 20) return message.channel.send('Please provide a valid role');

        var customLevel = args[0];
        
        if (!customLevel) return message.channel.send('Please provide a level');
        if (isNaN(customLevel)) return message.channel.send('Please provide valid a level');
        if (customLevel < 1) return message.channel.send('Please provide a valid level');
        if (customLevel > 100) return message.channel.send('Please provide a smaller level');
        let roleFinded = message.guild.roles.cache.get(roleSelected3)
        if (!roleFinded) return message.channel.send("That role doesn't exist");

        await rolesSchema.findOneAndUpdate(
            {
                guildId: message.guild.id,
                level: customLevel,
                roleId: roleSelected3,
            },
            {
                guildId: message.guild.id,
                level: customLevel,
                roleId: roleSelected3,
                roleName: roleFinded.name
            },
            {
                upsert: true
            }
        )

        message.channel.send(`Reward <@&${roleSelected3}> settled for level ${customLevel}`)

    }
}