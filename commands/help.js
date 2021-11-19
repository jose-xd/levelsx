module.exports = {
    name: "help",
    desciption: "Get Help",

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