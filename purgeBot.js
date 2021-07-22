require('dotenv').config();
const { Client, Intents } = require("discord.js");
const intents = new Intents([
    Intents.NON_PRIVILEGED, // include all non-privileged intents, would be better to specify which ones you actually need
    "GUILD_MEMBERS", // lets you request guild members (i.e. fixes the issue)
]);
const client = new Client({ ws: { intents } });
client.on('ready', () => {
    console.log("I am ready!");
});

client.on('message', message => {
    if(!message.guild) return;
    if(!message.member.hasPermission("ADMINISTRATOR")) return;
    else if(message.content.toLowerCase() === "%purgenorole"){
        message.reply("Are you sure you want to kick all members without a role?\n"+
        "Confirm with a thumb up or deny with a thumb down.")
        .then(m => {
            m.react('👍').then(r => {
            m.react('👎');});
            m.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎'),
            { max: 1, time: 15000 }).then(collected => {
                if (collected.first().emoji.name == '👍') {
                    message.channel.send('Kicking all members without a role...');
                    purgeNoRole(message);
                } else {
                    message.reply('Operation canceled.');
                } 
            }).catch(() => {
                message.channel.send('No reaction after 15 seconds, operation canceled');
            });
        });
    }
    else if(message.content.toLowerCase() === "%countpurge"){
        countPurge(message);
    }
});

function purgeNoRole(message){
    console.log("PURGING");
    message.guild.members.fetch()
    .then(members=>{
        let i = 0;
        members.each(member=>{
            if(member.roles.cache.size < 2){
                member.kick("Member has no roles. Authentication has not been completed.")
                .catch(() => {
                    console.error;
                });
                i++;
            }
        });
        message.channel.send("Kicked " + i + " members.");
        console.log("Kicked " + i + " members.");
    })
    .catch(console.error);
}

function countPurge(message){
    console.log("COUNTING");
    message.guild.members.fetch()
    .then(members=>{
        let i = 0;
        members.each(member=>{
            if(member.roles.cache.size < 2){
                i++;
            }
        });
        console.log("There are " + i + " members without a role.");
        message.channel.send("There are " + i + " members without a role.");
    });
}

client.login(process.env.BOT_TOKEN);