/*
 * This file is called by the MAL command to retrieve and display entry data.
 */

require("dotenv").config();

const { MessageEmbed } = require('discord.js');
// const puppeteer = require('puppeteer');
const request = require('request');
const cheerio = require('cheerio');

module.exports = {
  name: 'malentry',
  category: 'webscrape',
  description: 'search anime',
  usage: `malentry`,
  async execute(message, args, command, client, Discord, entryURL){
    await request(entryURL, (error, response, html) => {
      if (!error && response.statusCode == 200) {
        // extract data from page HTML
        const $ = cheerio.load(html);
        const title = $('strong', '.title-name.h1_bold_none').text();
        console.log("Title: "+title);
        
        let titleEN = $('.title-english.title-inherit').text();
        if (!titleEN) {
          titleEN = title;
        }
        console.log("EN: "+titleEN);

        const imgURL = $('.lazyload').attr("data-src");
        const charImg = $('img', '.picSurround').attr('data-src');
        
        let desc = $('meta[property="og:description"]').attr('content');
        if (desc.length > 1024) {
          desc=desc.substring(0, 1022) + "…";
        }
        
        let rating = $('span[itemprop="ratingValue"]').text();
        if (!rating) {
          rating = "N/A"
        }
        
        const ranking = $('strong','.numbers.ranked').text();
        const members = $('strong', '.numbers.members').text();
        // Multiple OPs or EDs will display in a numerical list
        let op = $('td[width="84%"]', '.theme-songs.js-theme-songs.opnening').text();
        let ed = $('td[width="84%"]', '.theme-songs.js-theme-songs.ending').text();
        if (!op) {
          op = "None";
        }
        if (op.length > 1024) {
          op = op.substring(0, 1022)+"…";
        }
        if (!ed) {
          ed = "None";
        }
        if (ed.length > 1024) {
          ed = ed.substring(0, 1022)+"…";
        }

        //log extracted values
        console.log(rating + " " + ranking + " " + members);
        console.log(op + " " + ed);
        console.log(desc);
        
        // Creates an embed. Edit attributes and placement as needed.
        const embed = new MessageEmbed()
          .setColor("BLUE")
          .setTitle(title)
          .setURL(entryURL)
          .setImage(imgURL)
          //.setDescription('')
          .setThumbnail(charImg)
          .setAuthor({ name: titleEN, iconURL: 'https://image.myanimelist.net/ui/OK6W_koKDTOqqqLDbIoPAiC8a86sHufn_jOI-JGtoCQ'})
          .addFields(
      		  { name: 'Rating', value: rating, inline: true },
            { name: 'Ranking', value: ranking, inline: true },
            { name: 'Members', value: members, inline: true },
        		{ name: '\u200B', value: '\u200B' },
        		{ name: 'Description', value: desc},
        		{ name: 'OP', value: op, inline: true },
            { name : 'ED', value: ed, inline: true}
	        );
    
      message.channel.send({ embeds: [embed] });
      }
    })
  }
}
