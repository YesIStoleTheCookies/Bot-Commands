// This file contains the first portion of the command, which makes a request to the MAL search page
// which processes a search to find the best matching entry.
// The second portion makes a request to the entry URL to pull anime data.


require("dotenv").config();

const { MessageEmbed } = require('discord.js');
// const puppeteer = require('puppeteer');
const request = require('request');
const cheerio = require('cheerio');

module.exports = {
  name: 'mal',
  category: 'webscrape',
  description: 'To search the MyAnimeList database, use [prefix]mal [search term(s)]',
  usage: `mal`,
  async execute(message, args, command, client, Discord){

    message.channel.send("Loading search: "+ args.join(" "));

    let entryURL = "";
    await request("https://myanimelist.net/search/all?q="+args.join(" "), (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        entryURL = $('a', '.title').attr("href");
        console.log(entryURL);
        entryURL=entryURL.substring(0, 36);
        if (!entryURL) {
          return message.channel.send("No Results For: " + args.join(" "));
        }
        client.commands.get("malentry").execute(message, args, command, client, Discord, entryURL);
      }
    });
    console.log("out");

        
        
    
  }
}
      
    // Alt code for Puppeteer
    // 
    // let searchURL = "https://myanimelist.net/search/all?cat=all&q="+args.join(" ");

    // let browser = await puppeteer.launch();
    // let page = await browser.newPage();
    // await page.goto(searchURL, {waitUntil: 'networkidle2'});

    // await page.evaluate(() => {
    //   searchURL = document.querySelector('div[class="information di-tc va-t pt4 pl8"] > div[class="title"] > a').getAttribute("href");
    // })

    // await page.goto(searchURL, {waitUntil: 'networkidle2'});
    // let info = await page.evaluate (() => {
    //   let title = document.querySelector('h1[class="title-name h1_bold_none"] > strong').innerText;
    //   let titleEN = document.querySelector('p[class="title-english title-inherit"]').innerText;

    //   let imgURL = document.querySelector('img[class=" lazyloaded"]').getAttribute("src");

    //   return {
    //     title,
    //     titleEN,
    //     imgURL
    //   }
    // })

    // await browser.close();
