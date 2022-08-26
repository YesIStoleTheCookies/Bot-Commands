/*
 * Makes a HTML request to henrikdev's unofficial valorant API to extract user competitive data.
 * Then, constructs and sends a Discord embed to display stats, including a link to more detailed data.
 */
require("dotenv").config();

const { MessageEmbed } = require('discord.js');
const request = require('request');
const cheerio = require('cheerio');

module.exports = {
  name: 'valoStats',
  category: 'webscrape',
  description: 'search anime',
  usage: `valoStats`,
  async execute(message, args, command, client, Discord, accountData){    let statsData = JSON.parse("{}");
    await request("https://api.henrikdev.xyz/valorant/v1/mmr/na/" + args.join('/'), (error, response, html) => {
      if (!error && response.statusCode == 200) {
        
        const $ = cheerio.load(html);
        statsData = JSON.parse($('body').text());


        const embed = new MessageEmbed()
          .setColor("RED")
          .setTitle(accountData.data.name+" #"+accountData.data.tag)
          .setURL("https://tracker.gg/valorant/profile/riot/" + accountData.data.name + "%23" + accountData.data.tag + "/overview")
          .setImage(statsData.data.card.wide)
          .setDescription('hopcon?')
          .setThumbnail(accountData.data.images.large)
          .setAuthor({ name: "Lvl."+accountData.data.account_level, iconURL: accountData.data.card.small})
          .addFields(
      		  { name: statsData.data.currenttierpatched, value: statsData.ranking_in_tier, inline: true },
            { name: 'elo rating', value: statsData.elo, inline: true },
            { name: 'rr change', value: statsData.mmr_change_to_last_game, inline: true },
        		{ name: '\u200B', value: '\u200B' },
        		{ name: 'stuff', value: "stuff"},
        		{ name: 'last update', value: "um", inline: true },
            { name : 'hop', value: "con", inline: true}
	        );
    
      message.channel.send({ embeds: [embed] });
      }
    })
  }
}
