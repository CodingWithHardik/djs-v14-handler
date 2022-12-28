const { glob } = require('glob');
const { Client, REST, Routes } = require('discord.js');
const mongoose = require('mongoose');
const { promisify } = require("util");
const globPromise = promisify(glob);
const ascii = require('ascii-table');
let messageCmdTable = new ascii("Message Commands");
messageCmdTable.setHeading('File Name', 'Load Status');
let slashCmdTable = new ascii("Slash Commands");
slashCmdTable.setHeading('File Name', 'Load Status');
let eventTable = new ascii("Events File");
eventTable.setHeading('File Name', 'Load Status');

/**
 * @param {Client} client
 */

module.exports = async (client) => {
    const commandFiles = await globPromise(`${process.cwd().replace(/\\/g, "/")}/MessageCommand/**/*.js`);
    commandFiles.map((value) => {
        const file = require(value);
        const splitted = value.split("/");
        const filename = splitted[splitted.length - 1];
        const directory = splitted[splitted.length - 2];
        if (file.name) {
            const properties = { directory, ...file };
            client.MessageCommands.set(file.name, properties);
            messageCmdTable.addRow(filename,'✅')
        } else {
            messageCmdTable.addRow(filename, '❌ -> Missing a help.name, or help.name is not a string.')
        }
    })
    console.log(messageCmdTable.toString())

    const eventFiles = await globPromise(`${process.cwd().replace(/\\/g, "/")}/events/*.js`);
    eventFiles.map((value) => {
        require(value)
        const splitted = value.split("/");
        const filename = splitted[splitted.length - 1];
        eventTable.addRow(filename, '✅')
    });
    console.log(eventTable.toString())

    const slashCommands = await globPromise(`${process.cwd().replace(/\\/g, "/")}/SlashCommand/**/*.js`);
    const arrayOfSlashCommands = [];
    const rest = new REST({ version: '10' }).setToken(client.config.token)
    slashCommands.map((value) => {
        const file = require(value);
        const splitted = value.split("/");
        const filename = splitted[splitted.length - 1];
        if (!file?.name) return slashCmdTable.addRow(filename, '❌ -> Missing a help.name, or help.name is not a string.')
        if (!file?.description) return slashCmdTable.addRow(filename, '❌ -> Missing a help.description, or help.description is not a string.')
        client.SlashCommands.set(file.name, file);
        if (["MESSAGE", "USER"].includes(file.type)) delete file.description;
        arrayOfSlashCommands.push(file)
        slashCmdTable.addRow(filename,'✅')
    })
    client.on("ready", async () => {
        (async () => {
            try {
                await rest.put(Routes.applicationCommands(client.user.id), { body: arrayOfSlashCommands });
            } catch (error) {
                console.log(error);
            }
        })();
    });
    console.log(slashCmdTable.toString())

    const { mongodb } = require('../config.json')
    if (!mongodb) return;

    mongoose.connect(mongodb).then(() => console.log('Connected to mongodb'));
}