/**
 * @author Sammy (stegaBOB)
 *
 * @dev If you want to start up a purgeBOT on your own, add a .env file that contains
 *      `BOT_TOKEN="YOUR BOT TOKEN HERE"` or just replace the process.env.BOT_TOKEN
 *      in client.login with your token. Also, make sure to enable "SERVER MEMBERS INTENT"
 *      under the "Privileged Gateway Intents" section in the Bot category on the Discord bot page.
 */

require('dotenv').config();
const {Client, Intents} = require("discord.js");
const intents = new Intents([
    Intents.NON_PRIVILEGED, // include all non-privileged intents, would be better to specify which ones you actually need
    "GUILD_MEMBERS", // lets you request guild members (i.e. fixes the issue)
]);
const client = new Client({ws: {intents}});
client.on('ready', () => {
    console.log("I am ready!");
});

client.on('message', message => {
    if (!message.guild || message.member === null) return;

    if (message.content.toLowerCase().includes("pog")){
        message.react("<:pog:599513814328672266>")
            // .then(m => {
            //     message.channel.send("<:pog:599513814328672266>")
            //         .then(m2 => {
            //             console.log(m2)
            //             m2.delete({ timeout: 500 });
            //         })
            // })
            .catch(err => {
                console.log(err);
            })
    }

    //Moderator only commands:
    if (message.member.hasPermission("ADMINISTRATOR") || message.member.roles.cache.find(r => r.name === "Moderator")) {
        if (message.content.toLowerCase().startsWith("%countlessthan")) {
            let numRoles = parseInt(message.content.split(' ')[1]);
            countRoles(message, numRoles);
            // message.delete({timeout: 5000});
            return;
        } else if (message.content.toLowerCase() === "%purgenorole") {
            message.channel.send("Counting members. Please wait...").then(m => {
                purgeNoRoleCheck(message);
            });
        } else if (message.content.toLowerCase().startsWith("%banstartswith")) {
            let theMessage = message.content.split(' ');
            if (theMessage.length < 2) {
                message.channel.send('Name parameter not inlcuded in message. Operation canceled.\nExample: `%banstartswith EonCharge`')
                    // .then(m=>{m.delete({timeout: 5000})});
                // message.delete({timeout: 5000})
                return;
            } else {
                let theName = theMessage[1];
                if (theName.length < 3) {
                    message.channel.send('I think you typed incorrectly. Try again with a username longer than 3 characters. Operation canceled.\nExample: `%banstartswith EonCharge`')
                        // .then(m=>{m.delete({timeout: 5000})});
                    // message.delete({timeout: 5000});
                    return;
                } else {
                    message.channel.send("Counting members. Please wait...").then(m => {
                            banStartWithCheck(message, theName);
                            // message.delete({timeout: 5000});
                        });
                    return;
                }
            }
        } else if (message.content.toLowerCase() === "%purgepending") {
            message.channel.send("Counting members. Please wait...").then(m => {
                purgePendingCheck(message);
                // message.delete({timeout: 5000});
                return;
            });
        }
    }


    //Admin only commands:

    if (message.member.hasPermission("ADMINISTRATOR")) {

    }
});

function purgeNoRole(message, purgeList) {
    console.log(purgeList);
    const promises = [];
    purgeList.forEach(member => {
        promises.push(member.kick("Member has not completed Membership Screening. Please rejoin and try again."));
    });
    Promise.all(promises)
        .then(results => {
            console.log(results);
            console.log(`promises.length = ${promises.length}`);
            message.channel.send(`Successfully kicked ${promises.length} members.`);
            console.log(`Successfully kicked ${promises.length} members.`);
        })
        .catch(err => {
            console.error(err);
            message.reply("I think there was an error kicking members. Blame Bob's poor coding.");
        });
}

function purgeNoRoleCheck(message){
    message.guild.members.fetch()
        .then(members => {
            let purgeList = [];
            members.each(member => {
                if (member.roles.cache.size < 2) {
                    purgeList.push(member);
                }
            });
            if (purgeList.length < 1) {
                // message.delete();
                message.channel.send(`I couldn't find any members without any roles. Please try again later.`)
                    // .then(m=>{m.delete({timeout: 5000})});
                return;
            }
            message.reply(`Are you sure you want to kick all ${purgeList.length} members with no roles?\n` +
                "Confirm with a thumb up or deny with a thumb down.")
                .then(m => {
                    m.react('👍').then(r => {
                        m.react('👎');
                    });
                    // message.delete();
                    m.awaitReactions((reaction, user) => user.id === message.author.id && (reaction.emoji.name === '👍' || reaction.emoji.name === '👎'),
                        {max: 1, time: 15000})
                        .then(collected => {
                            // m.delete({timeout: 5000});
                            if (collected.first().emoji.name === '👍') {
                                message.channel.send(`Kicking all ${purgeList.length} members with no roles...`);
                                purgeNoRole(message, purgeList);
                                // message.channel.send("would have kicked here");
                            } else {
                                message.channel.send('Operation canceled.')
                                    // .then(m=>{m.delete({timeout: 5000})});
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                            message.channel.send('No reaction after 15 seconds, operation canceled')
                                // .then(m=>{m.delete({timeout: 5000})});
                        });
                })
                .catch(err => {
                    console.err(err);
                    message.channel.send("Uh oh...");
                });
        })
        .catch(err => {
            console.err(err);
            message.channel.send("Uh oh...");
        });
}

function purgePending(message, pendingList) {
    console.log(pendingList);
    const promises = [];
    pendingList.forEach(member => {
        promises.push(member.kick("Member still pending. Please rejoin and try again."));
    });
    Promise.all(promises)
        .then(results => {
            console.log(results);
            console.log(`promises.length = ${promises.length}`);
            message.channel.send(`Successfully kicked ${promises.length} members.`);
            console.log(`Successfully kicked ${promises.length} members.`);
        })
        .catch(err => {
            console.error(err);
            message.reply("I think there was an error kicking members. Blame Bob's poor coding.");
        });
}

function purgePendingCheck(message){
    message.guild.members.fetch()
        .then(members => {
            let pendingList = [];
            members.each(member => {
                if (member.roles.cache.size === 2 && member.roles.cache.find(r => r.name === "Pending")) {
                    pendingList.push(member);
                }
            });
            if (pendingList.length < 1) {
                // message.delete();
                message.channel.send(`I couldn't find any pending members. Please try again later.`)
                    // .then(m=>{m.delete({timeout: 5000})});
                return;
            }
            message.reply(`Are you sure you want to kick all ${pendingList.length} pending members?\n` +
                "Confirm with a thumb up or deny with a thumb down.")
                .then(m => {
                    m.react('👍').then(r => {
                        m.react('👎');
                    });
                    m.awaitReactions((reaction, user) => user.id === message.author.id && (reaction.emoji.name === '👍' || reaction.emoji.name === '👎'),
                        {max: 1, time: 15000})
                        .then(collected => {
                            // message.delete();
                            // m.delete({timeout: 5000});
                            if (collected.first().emoji.name === '👍') {
                                message.channel.send(`Kicking all ${pendingList.length} pending members...`)
                                purgePending(message, pendingList);
                                // message.channel.send("would have kicked here");
                            } else {
                                message.channel.send('Operation canceled.')
                                    // .then(m=>{m.delete({timeout: 5000})});
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                            message.channel.send('No reaction after 15 seconds, operation canceled')
                                // .then(m=>{m.delete({timeout: 5000})});
                        });
                })
                .catch(err => {
                    console.err(err);
                    message.channel.send("Uh oh...");
                });
        })
        .catch(err => {
            console.err(err);
            message.channel.send("Uh oh...");
        });
}

function banStartsWith(message, name, banList) {
    console.log("hi");
    if (name.length < 3) {
        message.channel.send("Uh oh. This shouldn't be possible. REEEEEEEEEEE");
        return;
    } else {
        console.log(banList);
        const promises = [];
        banList.forEach(member => {
            promises.push(member.ban({
                reason: 'Bots!!',
            }));
        });
        Promise.all(promises)
            .then(results => {
                console.log(results);
                console.log(`promises.length = ${promises.length}`);
                message.channel.send(`Successfully banned ${promises.length} members.`);
                console.log(`Successfully banned ${promises.length} members.`);
            })
            .catch(err => {
                console.error(err);
                message.reply("I think there was an error banning members. Blame Bob's poor coding.");
            });
    }
}

function banStartWithCheck(message, name) {
    message.guild.members.fetch()
        .then(members => {
            let banList = [];
            members.each(member => {
                if (member.user.username.startsWith(name)) {
                    banList.push(member);
                }
            });
            if (banList.length < 1) {
                // message.delete();
                message.channel.send(`I couldn't find any members whose name starts with ${name}. Please try again later.`)
                    // .then(m=>{m.delete({timeout: 5000})});
                return;
            }
            message.reply(`Are you sure you want to ban all ${banList.length} members whose name starts with ${name}?\n` +
                "Confirm with a thumb up or deny with a thumb down.")
                .then(m => {
                    m.react('👍').then(r => {
                        m.react('👎');
                    });
                    // message.delete();
                    m.awaitReactions((reaction, user) => user.id == message.author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎'),
                        {max: 1, time: 15000})
                        .then(collected => {
                            // m.delete({timeout: 5000});
                            if (collected.first().emoji.name == '👍') {
                                message.channel.send(`Banning all ${banList.length} members whose name starts with ${name}...`);
                                banStartsWith(message, name, banList);
                                // message.channel.send("would have banned here");
                            } else {
                                message.channel.send('Operation canceled.')
                                    // .then(m=>{m.delete({timeout: 5000})});
                            }
                        })
                        .catch((err) => {
                            console.log(err);
                            message.channel.send('No reaction after 15 seconds, operation canceled')
                                // .then(m=>{m.delete({timeout: 5000})});
                        });
                })
                .catch(err => {
                    console.err(err);
                    message.channel.send("Uh oh...");
                });
        })
        .catch(err => {
            console.err(err);
            message.channel.send("Uh oh...");
        });
}

function countRoles(message, lessThanRoles = 1) {
    console.log(`COUNTING MEMBERS WITH LESS THAN ${lessThanRoles} ROLE(S)`);
    message.channel.send(`Counting members with less than ${lessThanRoles} roles...`);
    message.guild.members.fetch()
        .then(members => {
            let i = 0;
            members.each(member => {
                if (member.roles.cache.size < (lessThanRoles + 1)) {
                    i++;
                }
            });
            console.log(`There are ${i} members with less than ${lessThanRoles} role(s).`);
            message.channel.send(`There are ${i} members with less than ${lessThanRoles} role(s).`);
        })
        .catch(err => {
            console.err(err);
            message.channel.send("Uh oh...");
        });
}

client.login(process.env.BOT_TOKEN);