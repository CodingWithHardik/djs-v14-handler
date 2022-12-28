const { Message, Client } = require("discord.js");

module.exports = {
    name: "ping",
    aliases: ["p"],
    /**
     * @param {Client} client
     * @param {Message} message
     * @param {String[]} args
     */
    run: async (client, message, args) => {
        message.channel.send({ content: `${client.ws.ping}ms!` })
    },
};