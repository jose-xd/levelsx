const profileSchema = require('../schemas/profile-schema')

module.exports = {
    name: "leaderboard",
    desciption: "View the leaderboard",

    async execute(client, message, cmd, args) {

        const guildResult = await profileSchema.find({
            guildId: message.guild.id
        }).sort({ level: 'desc' }).limit(10);

        let reply = `Leaderboard: \n\n`

        for (const result of guildResult) {
            const { username, level, xp } = result

            reply += `${username}: Level: ${level} | XP: ${xp} \n\n`
        }

        message.channel.send(reply);

    }
}