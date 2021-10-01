/**
 * @author Sammy (stegaBOB)
 *
 * @dev If you want to start up a purgeBOT on your own, add a .env file that contains
 *      `BOT_TOKEN="YOUR BOT TOKEN HERE"` or just replace the process.env.BOT_TOKEN
 *      in client.login with your token. Also, make sure to enable "SERVER MEMBERS INTENT"
 *      under the "Privileged Gateway Intents" section in the Bot category on the Discord bot page.
 */

require('dotenv').config();
const { Discord, Client, Intents, MessageActionRow, MessageButton, MessageEmbed, DiscordAPIError, Collection } = require('discord.js');
const client = new Client({
    intents:
        [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_MESSAGE_REACTIONS],
});
client.once('ready', () => {
    console.log("I am ready!");
});

const NFT_MOD_ROLE_ID = "826028582739640354";
const NFT_JUNIOR_MOD_ID = "829797969586552902";
const NFT_SENIOR_MOD_ID = "829594906376011847";

const RCC_SERVER_ID = "390628544369393664";
const NFT_SERVER_ID = "825779851205279825";

const MOD_IDS = ["371482743030284298", "269939001773785097", "86259271070650368", "392547150480932864", "392747100187787276", "324434321454792706", "238305566890524684", "430257754574422017", "382753332504166403", '181488885044346880', '253481834334257162', '673396875470176256',
    '251717518484439040', '192617193224011786', '337679855107702786', '562394948499013636', '297693488936517632', '354332171005329408', '433413408721862656'];
const MOD_IDS_SET = new Set(MOD_IDS);
const MOD_NAMES = ["buddha", "Caid (CEST NL)", "Mexzter", "Chris9k", "jwinterm [won't DM]", "moro", "SuperFlyTNT2", "B0T", "1337BAKA", "bark0de",
    "collectevolution", "cucurbit.eth", "LanceDwight", "Lazarus", "Pornflakes", "Singularity", "Raizen", "sgp", "stegaBOB", "stegaBOB [Potassium Blob]"];
const MOD_NAMES_SET = new Set(MOD_NAMES.toString().toLowerCase().split(','));

const RCC_MOD_CHANNEL_ID = "805552066553577563";
const NFT_MOD_CHANNEL_ID = "829798424215420929";

const NFT_MOD_IDS = ["814467375952953344", "292670233972310019", "194751257305415680", "260340001110228994", "387054136484560896", "316505478735593472", "365668214601940992"];
const NFT_MOD_IDS_SET = new Set(NFT_MOD_IDS);
const NFT_MOD_NAMES = ["watanuki🧬", "watanuki", "goblinmessiah", "palpable", "prealle", "colletteisabear", "mtimetraveller", "anjuthemage", ".time traveller."];
const NFT_MOD_NAMES_SET = new Set(NFT_MOD_NAMES.toString().toLowerCase().split(','));


client.on('guildMemberAdd', async member => {
    if (member.guild.id === RCC_SERVER_ID) {
        if (!MOD_IDS_SET.has(member.id)) {
            if (MOD_NAMES_SET.has(member.user.username.toLowerCase())) {
                try {
                    await member.guild.members.ban(member, { days: 7, reason: 'Same username as a moderator' });
                    console.log('Banned: ', member.user.tag);
                    const modChannel = member.guild.channels.resolve(RCC_MOD_CHANNEL_ID);
                    const modScamEmbed = embedFactory('green', `Banned **${member.user.tag}** for impersonating a moderator.`);
                    await modChannel.send({ embeds: [modScamEmbed] }).catch(err => {
                        console.error('Trying to send modScamMessage - ', err);
                    });

                } catch (err) {
                    console.error(err.message, `: when trying to ban ${member.user.tag}`);
                    if (err instanceof DiscordAPIError) {
                        console.log(`Error code: ${err.code}`);
                    }
                    else {
                        console.log('Error: ', err);
                    }
                }
            }
        }
    } else if (member.guild.id === NFT_SERVER_ID) {
        if (!NFT_MOD_IDS_SET.has(member.id)) {
            if (NFT_MOD_NAMES_SET.has(member.user.username.toLowerCase())) {
                try {
                    await member.guild.members.ban(member, { days: 7, reason: 'Same username as a moderator' });
                    console.log('Banned: ', member.user.tag);
                    const modChannel = member.guild.channels.resolve(NFT_MOD_CHANNEL_ID);
                    const modScamEmbed = embedFactory('green', `Banned **${member.user.tag}** for impersonating a moderator.`);
                    await modChannel.send({ embeds: [modScamEmbed] }).catch(err => {
                        console.error('Trying to send modScamMessage - ', err);
                    });

                } catch (err) {
                    console.error(err.message, `: when trying to ban ${member.user.tag}`);
                    if (err instanceof DiscordAPIError) {
                        console.log(`Error code: ${err.code}`);
                    }
                    else {
                        console.log('Error: ', err);
                    }
                }
            }
        }
    }
});

client.on('messageCreate', async message => {
    if (!message.guild || message.member === null) return;
    //Moderator only commands:

    if (message.member.permissions.has("ADMINISTRATOR") || message.member.roles.cache.find(r => r.name === "Moderator") || message.member.roles.cache.find(r => r.id === NFT_MOD_ROLE_ID)
        || message.member.roles.cache.find(r => r.id === NFT_JUNIOR_MOD_ID) || message.member.roles.cache.find(r => r.id === NFT_SENIOR_MOD_ID)) {
        let author = message.author;
        let theChannel = message.channel;

        if (message.content.toLowerCase().startsWith("%banmodscam")) {
            const waitEmbedThing = embedFactory('blue', 'Counting members. Please wait...')
            let waitEmbed = await message.channel.send({ embeds: [waitEmbedThing] }).catch(err => {
                console.error('Trying to send waitEmbedThingy - ', err);
                return;
            });
            banModScamCheck(waitEmbed, message.author);
            setTimeout(async () => {
                await message.delete()
                    .catch(err => {
                        console.error('Trying to delete ban message - ', err);
                    });
            }, 1000);
            return;
        }


        if (message.content.toLowerCase().startsWith("%banstartswith")) {
            let theMessage = message.content.split(' ');
            if (theMessage.length < 2) {
                const noNameEmbed = embedFactory('red', 'Name parameter not inlcuded in message. Operation canceled.\nExample: `%banstartswith EonCharge`');
                await theChannel.send({ embeds: [noNameEmbed] }).catch(err => {
                    console.error('Trying to send noNameEmbed - ', err);
                });
                setTimeout(async () => {
                    await message.delete()
                        .catch(err => {
                            console.error('Trying to delete ban message - ', err);
                        });
                }, 1000);
                return;
            } else {
                let theName = message.content.toLowerCase().substring(15);
                if (theName.length < 4) {
                    const shortNameEmbed = embedFactory('red', 'I think you typed incorrectly. Try again with a username longer than 3 characters. Operation canceled.\nExample: `%banstartswith EonCharge`');
                    await theChannel.send({ embeds: [shortNameEmbed] }).catch(err => {
                        console.error('Trying to send noNameEmbed - ', err);
                    });
                    setTimeout(async () => {
                        await message.delete()
                            .catch(err => {
                                console.error('Trying to delete ban message - ', err);
                            });
                    }, 1000);
                    return;
                } else {
                    const waitEmbedThing = embedFactory('blue', 'Counting members. Please wait...')
                    let waitEmbed = await message.channel.send({ embeds: [waitEmbedThing] }).catch(err => {
                        console.error('Trying to send waitEmbedThingy - ', err);
                        return;
                    });
                    banStartWithCheck(waitEmbed, theName, author);
                    setTimeout(async () => {
                        await message.delete()
                            .catch(err => {
                                console.error('Trying to delete ban message - ', err);
                            });
                    }, 1000);
                    return;
                }
            }
        } else if (message.content.toLowerCase().startsWith("%purgenorole")) {
            const waitEmbedThing = embedFactory('blue', 'Counting members. Please wait...')
            let waitEmbed = await message.channel.send({ embeds: [waitEmbedThing] }).catch(err => {
                console.error('Trying to send waitEmbedThingy - ', err);
                return;
            });
            purgePendingCheck(waitEmbed, author);
            setTimeout(async () => {
                await message.delete()
                    .catch(err => {
                        console.error('Trying to delete purgePending message - ', err);
                    });
            }, 1000);
            return;
        }
    }

});


// async function queryCheckFunction(waitEmbed, checkFunction, doFunction, messageObj, parameterObj){
//     let theGuild = waitEmbed.guild;
//     let members = await theGuild.members.fetch()
//         .catch(err => console.error('Trying to fetch members - ', err));
//     let matchList = [];
//     members.each((member) => {
//         checkFunction(member, matchList);
//     });

//     if (matchList.length < 1) {
//         const cantFindEmbed = embedFactory('red', messageObj.cantFindEmbed)
//         //  `I couldn't find any members whose name starts with **${name}**. Please try again later.`);
        
//         await waitEmbed.edit({ embeds: [cantFindEmbed] })
//             .catch(() => console.error('Trying to send can\'t find embed - ', err));
//         return;
//     }
//     const confirmReplyEmbedNormal = embedFactory('blue', messageObj.confirmReplyEmbedNormal);
//     // `Are you sure you want to ban all **${banList.length}** members whose name starts with **${name}**?\n` +
//     //     "Confirm with a thumb up or deny with a thumb down.");

//     const confirmReplyEmbedLong = embedFactory('orange', messageObj.confirmReplyEmbedLong);
    
//     // `**Thats a lot of people!** \nAre you ***REALLLY*** sure you want to ban all **${matchList.length}** members whose name starts with **${name}**?\n` +
//     //     "Confirm with a thumb up or deny with a thumb down.");
//     await waitEmbed.edit({ embeds: [(matchList.length) < 100 ? confirmReplyEmbedNormal : confirmReplyEmbedLong] })
//         .catch(() => console.error('Trying to send confirm reply embed - ', err));
//     await waitEmbed.react('👍')
//         .catch(() => console.error('Trying to react with thumbs up - ', err));
//     await waitEmbed.react('👎')
//         .catch(() => console.error('Trying to react with thumbs down - ', err));

//     const filter = (reaction, user) => user.id === author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎');
//     const collector = waitEmbed.createReactionCollector({ filter, max: 1, time: 15000 });
//     collector.on('end', async collected => {
//         console.log(`Collected ${collected.size} items`)
//         const cancelEmbed = embedFactory('red', 'Operation canceled.');
//         if (collected.size === 0 || collected.first().emoji.name !== '👍') {
//             await waitEmbed.edit({ embeds: [cancelEmbed] })
//                 .catch(() => console.error('Trying to send cancel embed - ', err));
//             await waitEmbed.reactions.removeAll()
//                 .catch(() => console.error('Trying to remove reactions - ', err));
//         } else if (collected.first().emoji.name == '👍') {
//             await waitEmbed.reactions.removeAll()
//                 .catch(() => console.error('Trying to remove reactions - ', err));
//             doFunction(waitEmbed, matchList, parameterObj)
//         }
//     });

// }

async function banStartWithCheck(waitEmbed, name, author) {
    let theGuild = waitEmbed.guild;
    let members = await theGuild.members.fetch()
        .catch(err => console.error('Trying to fetch members - ', err));
    let banList = [];
    members.each(member => {
        if (member.user.username.toLowerCase().startsWith(name.toLowerCase()) || member.user.id.startsWith(name.toLowerCase())) {
            banList.push(member);
        }
    });
    let tagList = [];
    for (const member of banList) {
        tagList.push(member.user.tag);
    }
    console.log('banList tags: ', tagList);

    if (banList.length < 1) {
        const cantFindEmbed = embedFactory('red', `I couldn't find any members whose name starts with **${name}**. Please try again later.`);
        await waitEmbed.edit({ embeds: [cantFindEmbed] })
            .catch((err) => console.error('Trying to send couldn\'t find members embed - ', err));
        return;
    }
    const confirmReplyEmbed = embedFactory('blue', `Are you sure you want to ban all **${banList.length}** members whose name starts with **${name}**?\n` +
        "Confirm with a thumb up or deny with a thumb down.");

    const confirmReplyEmbed2 = embedFactory('orange', `**Thats a lot of people!** \nAre you ***REALLLY*** sure you want to ban all **${banList.length}** members whose name starts with **${name}**?\n` +
        "Confirm with a thumb up or deny with a thumb down.");
    await waitEmbed.edit({ embeds: [(banList.length) < 100 ? confirmReplyEmbed : confirmReplyEmbed2] })
        .catch(() => console.error('Trying to send confirm reply embed - ', err));
    await waitEmbed.react('👍')
        .catch(() => console.error('Trying to react with thumbs up - ', err));
    await waitEmbed.react('👎')
        .catch(err => console.error('Trying to react with thumbs down - ', err));

    const filter = (reaction, user) => user.id === author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎');
    const collector = waitEmbed.createReactionCollector({ filter, max: 1, time: 15000 });
    collector.on('end', async collected => {
        console.log(`Collected ${collected.size} items`)
        const cancelEmbed = embedFactory('red', 'Operation canceled.');
        if (collected.size === 0 || collected.first().emoji.name !== '👍') {
            await waitEmbed.edit({ embeds: [cancelEmbed] })
                .catch(err => console.error('Trying to send cancel embed - ', err));
            await waitEmbed.reactions.removeAll()
                .catch(err => console.error('Trying to remove reactions - ', err));
        } else if (collected.first().emoji.name == '👍') {
            await waitEmbed.reactions.removeAll()
                .catch((err) => console.error('Trying to remove reactions - ', err));
            banStartsWith(waitEmbed, name, banList);
        }
    });
}

async function banStartsWith(waitEmbed, name, banList) {
    let theGuild = waitEmbed.guild;
    let theChannel = waitEmbed.channel;
    if (name.length < 4) {
        const uhOhEmbed = embedFactory('red', "Uh oh. This shouldn't be possible. REEEEEEEEEEE")
        await theChannel.send({ embeds: [uhOhEmbed] }).catch(err => {
            console.error('Trying to send uhOhEmbed - ', err);
        });
    } else {
        // let tagList = [];
        // for (const member of banList) {
        //     tagList.push(member.user.tag);
        // }
        // console.log('banList tags: ', tagList);
        let banCount = 0;
        let errorCount = 0;
        await waitEmbed.edit({
            embeds: [embedFactory('blue',
                `Attempting to ban member 1 of ${banList.length}`)]
        }).catch(err => {
            console.error('Trying to send statusEmbed - ', err);
        });
        for (let i = 1; i < banList.length + 1; i++) {
            try {
                await theGuild.members.ban(banList[i - 1], { days: 7 });
                banCount++;
                await waitEmbed.edit({
                    embeds: [embedFactory('blue',
                        `Attempting to ban member ${i} of ${banList.length}`)]
                }).catch(err => {
                    console.error('Trying to edit statusEmbed - ', err);
                });
            } catch (err) {
                errorCount++;
                console.error(err.message, `: when trying to ban ${banList[i - 1].user.tag}`);
                if (err instanceof DiscordAPIError) {
                    console.log(`Error code: ${err.code}`);
                    // if (err.code === 50013) {
                    //     const permissionEmbed = embedFactory('red', `Sorry, I don't have the permissions to ban **${banList[i-1].user.tag}**.`);
                    //     await theChannel.send({ embeds: [permissionEmbed] }).catch(err => {
                    //         console.error('Trying to send permissionEmbed - ', err);
                    //     });
                    // } else if (err.code === 10013) {
                    //     const permissionEmbed = embedFactory('red', `.`);
                    //     await theChannel.send({ embeds: [permissionEmbed] }).catch(err => {
                    //         console.error('Trying to send permissionEmbed - ', err);
                    //     });
                    // }
                    // else {
                    //     const apiErrorEmbed = embedFactory('red', `I ran into an DiscordAPIError when trying to ban **${banList[i-1].user.tag}**.\n*Error: ${err.message}.*`);
                    //     await theChannel.send({ embeds: [apiErrorEmbed] }).catch(err => {
                    //         console.error('Trying to send apiErrorEmbed - ', err);
                    //     });
                    // }
                }
                else {
                    console.log('Error: ', err);
                    // const otherErrorEmbed = embedFactory('red', `Sorry, I ran into an error trying to ban **${banList[i-1].user.tag}**.`);
                    // await theChannel.send({ embeds: [otherErrorEmbed] }).catch(err => {
                    //     console.error('Trying to send otherErrorEmbed - ', err);
                    // });
                }
            }
        }
        console.log(`Error count: ${errorCount}`);
        console.log(`Ban count: ${banCount}`);
        const goodEmbed = embedFactory('green', `Successfully banned ${(banCount === 1) ? `**${banList[0]}**.` : `**${banCount}** members whose names start with **${name}**.`}`);
        const badEmbed = embedFactory('orange', `Banned **${banCount}** ${banCount === 1 ? 'member whose name starts with' : 'members whose names start with'} **${name}** with **${errorCount}** ${errorCount === 1 ? 'error' : 'errors'}`);
        if (errorCount === 0) {
            await waitEmbed.edit({ embeds: [goodEmbed] }).catch(err => {
                console.error('Trying to send goodEmbed - ', err);
            });
        }
        else {
            await waitEmbed.edit({ embeds: [badEmbed] }).catch(err => {
                console.error('Trying to send badEmbed - ', err);
            });
        }
    }
}

async function banModScamCheck(waitEmbed, author) {
    const theGuild = waitEmbed.guild;
    let members = await theGuild.members.fetch()
        .catch(err => console.error('Trying to fetch members - ', err));
    let banList = [];
    if (theGuild.id === RCC_SERVER_ID) {
        members.each(member => {
            if (!MOD_IDS_SET.has(member.id)) {
                if (MOD_NAMES_SET.has(member.user.username.toLowerCase())) {
                    banList.push(member);
                    console.log(member.user.tag);
                }
            }
        });
    } else if (theGuild.id === NFT_SERVER_ID) {
        members.each(member => {
            if (!NFT_MOD_IDS_SET.has(member.id)) {
                if (NFT_MOD_NAMES_SET.has(member.user.username.toLowerCase())) {
                    banList.push(member);
                    console.log(member.user.tag);
                }
            }
        });
    } else {
        await waitEmbed.edit({ embeds: [new embedFactory("red", "This is not the r/NFT or r/CryptoCurrency server!")] })
            .catch(() => console.error('Trying to send wrong server embed - ', err));
        return;
    }

    if (banList.length < 1) {
        const cantFindEmbed = embedFactory('red', `I couldn't find any members who were impersonating a moderator. Please try again later.`);
        await waitEmbed.edit({ embeds: [cantFindEmbed] })
            .catch(() => console.error('Trying to send couldn\'t find members embed - ', err));
        return;
    }
    const confirmReplyEmbed = embedFactory('blue', `Are you sure you want to ban ${banList.length === 1 ? `**1** member who is` : `all **${banList.length}** members who are`} impersonating a moderator?\n` +
        "Confirm with a thumb up or deny with a thumb down.");

    await waitEmbed.edit({ embeds: [confirmReplyEmbed] })
        .catch(() => console.error('Trying to send confirm reply embed - ', err));
    await waitEmbed.react('👍')
        .catch(() => console.error('Trying to react with thumbs up - ', err));
    await waitEmbed.react('👎')
        .catch(() => console.error('Trying to react with thumbs down - ', err));

    const filter = (reaction, user) => user.id === author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎');
    const collector = waitEmbed.createReactionCollector({ filter, max: 1, time: 15000 });
    collector.on('end', async collected => {
        console.log(`Collected ${collected.size} items`)
        const cancelEmbed = embedFactory('red', 'Operation canceled.');
        if (collected.size === 0 || collected.first().emoji.name !== '👍') {
            await waitEmbed.edit({ embeds: [cancelEmbed] })
                .catch(() => console.error('Trying to send cancel embed - ', err));
            await waitEmbed.reactions.removeAll()
                .catch(() => console.error('Trying to remove reactions - ', err));
        } else if (collected.first().emoji.name == '👍') {
            await waitEmbed.reactions.removeAll()
                .catch(() => console.error('Trying to remove reactions - ', err));
            banModScam(waitEmbed, banList);
        }
    });
}

async function banModScam(waitEmbed, banList) {
    let banCount = 0;
    let errorCount = 0;
    const theGuild = waitEmbed.guild;
    await waitEmbed.edit({
        embeds: [embedFactory('blue',
            `Attempting to ban member 1 of ${banList.length}`)]
    }).catch(err => {
        console.error('Trying to send statusEmbed - ', err);
    });
    for (let i = 1; i < banList.length + 1; i++) {
        try {
            await theGuild.members.ban(banList[i - 1], { days: 7 });
            banCount++;
            await waitEmbed.edit({
                embeds: [embedFactory('blue',
                    `Attempting to ban member ${i} of ${banList.length}`)]
            }).catch(err => {
                console.error('Trying to edit statusEmbed - ', err);
            });
        } catch (err) {
            errorCount++;
            console.error(err.message, `: when trying to ban ${banList[i - 1].user.tag}`);
            if (err instanceof DiscordAPIError) {
                console.log(`Error code: ${err.code}`);
            }
            else {
                console.log('Error: ', err);
            }
        }
    }
    console.log(`Error count: ${errorCount}`);
    console.log(`Ban count: ${banCount}`);
    const goodEmbed = embedFactory('green', `Successfully banned **${banList[0]}** ${(banCount === 1) ? 'member that was impersonating a moderator.' : 'members that were impersonating a moderator.'}`);
    const badEmbed = embedFactory('orange', `Banned **${banCount}** ${banCount === 1 ? 'member who was' : 'members who were'} impersonating a moderator with **${errorCount}** ${errorCount === 1 ? 'error' : 'errors'}`);
    if (errorCount === 0) {
        await waitEmbed.edit({ embeds: [goodEmbed] }).catch(err => {
            console.error('Trying to send goodEmbed - ', err);
        });
    }
    else {
        await waitEmbed.edit({ embeds: [badEmbed] }).catch(err => {
            console.error('Trying to send badEmbed - ', err);
        });
    }
}

async function purgePendingCheck(waitEmbed, author) {
    let theGuild = waitEmbed.guild;
    let members = await theGuild.members.fetch()
        .catch(err => console.error('Trying to fetch members - ', err));
    let purgeList = [];
    members.each(member => {
        if (member.roles.cache.size < 2) {
            purgeList.push(member);
        }
    });
    let tagList = [];
    for (const member of purgeList) {
        tagList.push(member.user.tag);
    }
    // console.log('purgeList tags: ', tagList.toString());
    if (purgeList.length < 1) {
        const cantFindEmbed = embedFactory('red', `I couldn't find any members who don't have a roles. Please try again later.`);
        await waitEmbed.edit({ embeds: [cantFindEmbed] })
            .catch(() => console.error('Trying to send couldn\'t find members embed - ', err));
        return;
    }
    const confirmReplyEmbed = embedFactory('blue', `Are you sure you want to purge all **${purgeList.length}** members without a role?\n` +
        "Confirm with a thumb up or deny with a thumb down.");

    await waitEmbed.edit({ embeds: [confirmReplyEmbed] })
        .catch(() => console.error('Trying to send confirm reply embed - ', err));
    await waitEmbed.react('👍')
        .catch(() => console.error('Trying to react with thumbs up - ', err));
    await waitEmbed.react('👎')
        .catch(() => console.error('Trying to react with thumbs down - ', err));

    const filter = (reaction, user) => user.id === author.id && (reaction.emoji.name == '👍' || reaction.emoji.name == '👎');
    const collector = waitEmbed.createReactionCollector({ filter, max: 1, time: 15000 });
    collector.on('end', async collected => {
        console.log(`Collected ${collected.size} items`)
        const cancelEmbed = embedFactory('red', 'Operation canceled.');
        if (collected.size === 0 || collected.first().emoji.name !== '👍') {
            await waitEmbed.edit({ embeds: [cancelEmbed] })
                .catch(() => console.error('Trying to send cancel embed - ', err));
            await waitEmbed.reactions.removeAll()
                .catch(() => console.error('Trying to remove reactions - ', err));
        } else if (collected.first().emoji.name == '👍') {
            await waitEmbed.reactions.removeAll()
                .catch(() => console.error('Trying to remove reactions - ', err));
            purgePending(waitEmbed, purgeList);
        }
    });
}

async function purgePending(waitEmbed, purgeList) {
    let theGuild = waitEmbed.guild;
    let theChannel = waitEmbed.channel;
    // let tagList = [];
    // for (const member of purgeList) {
    //     tagList.push(member.user.tag);
    // }
    // console.log('purgeList tags: ', tagList.toString());
    let purgeCount = 0;
    let errorCount = 0;
    await waitEmbed.edit({
        embeds: [embedFactory('blue',
            `Attempting to purge member 1 of ${purgeList.length}`)]
    }).catch(err => {
        console.error('Trying to send statusEmbed - ', err);
    });
    for (let i = 1; i < purgeList.length + 1; i++) {
        try {
            await theGuild.members.kick(purgeList[i - 1]);
            purgeCount++;
            await waitEmbed.edit({
                embeds: [embedFactory('blue',
                    `Attempting to purge member ${i} of ${purgeList.length}`)]
            }).catch(err => {
                console.error('Trying to edit statusEmbed - ', err);
            });
        } catch (err) {
            errorCount++;
            console.error(err.message, `: when trying to purge ${purgeList[i - 1].user.tag}`);
            if (err instanceof DiscordAPIError) {
                console.log(`Error code: ${err.code}`);
            }
            else {
                console.log('Error: ', err);
            }
        }
    }
    console.log(`Error count: ${errorCount}`);
    console.log(`Purge count: ${purgeCount}`);
    const goodEmbed = embedFactory('green', `Successfully purged ${(purgeCount === 1) ? `**${purgeList[0]}**.` : `**${purgeCount}** members who didn't have a role.`}`);
    const badEmbed = embedFactory('orange', `Purged **${purgeCount}** ${purgeCount === 1 ? 'member' : 'members'} who didn't have a role with **${errorCount}** ${errorCount === 1 ? 'error' : 'errors'}`);
    if (errorCount === 0) {
        await waitEmbed.edit({ embeds: [goodEmbed] }).catch(err => {
            console.error('Trying to send goodEmbed - ', err);
        });
    }
    else {
        await waitEmbed.edit({ embeds: [badEmbed] }).catch(err => {
            console.error('Trying to send badEmbed - ', err);
        });
    }

}

function embedFactory(color, description) {
    let theColor;
    switch (color) {
        case 'red':
            theColor = '#cb2b2b';
            break;
        case 'green':
            theColor = '#3ba55c';
            break;
        case 'orange':
            theColor = '#ff711a';
            break;
        default:
            theColor = '#1f86ea';
            break;
    }
    return {
        color: (theColor),
        description: description,
    };
}

// function similarTimestamps(controlTS, offsetSeconds, other){
//     let otherTS = other>>>22;
//     if (
//         Math.abs(controlTS-otherTS) <= (offsetSeconds*1000)
//     )
// }


client.login(process.env.BOT_TOKEN);