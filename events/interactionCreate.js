const client = require('../index');

client.on('interactionCreate', async (interaction) => {
    if (interaction.isCommand()) {
        await interaction.deferReply({ ephemeral: false }).catch(() => {});
        const cmd = client.SlashCommands.get(interaction.commandName);
        if (!cmd) return interaction.followUp({ content: `An error has occured`});
        const args = [];
        for (let option of interaction.options.data) {
            if (option.type === 1) {
                if (option.name) args.push(option.name);
                option.options?.forEach((x) => {
                    if (x.value) args.push(x.value);
                })
            } else if (option.value) args.push(option.value);
        }
        interaction.member = interaction.guild.members.cache.get(interaction.user.id);
        cmd.run(client, interaction, args);
    }
    if (interaction.isContextMenuCommand()) {
        await interaction.deferReply({ ephemeral: false });
        const command = client.SlashCommands.get(interaction.commandName);
        if (command) command.run(client, interaction);
    }
})
