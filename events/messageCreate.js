const client = require('../index');

client.on('messageCreate', async (message) => {
    if (message.author.bot || !message.guild || !message.content.toLowerCase().startsWith(client.config.prefix)) return;
    const [cmd, ...args] = message.content.slice(client.config.prefix.length).trim().split(/ +/g)
    const command = client.MessageCommands.get(cmd.toLowerCase()) || client.MessageCommands.find(c => c.aliases?.includes(cmd.toLowerCase()));
    if (!command) return;
    await command.run(client, message, args);
})