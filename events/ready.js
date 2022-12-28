const client = require('../index')

client.on("ready", async (client) => {
    console.log(`${client.user.tag} is Online!`);
})