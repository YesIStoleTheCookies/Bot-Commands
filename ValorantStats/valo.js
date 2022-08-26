/*
 * Makes a HTML request to henrikdev's unofficial Valorant API to extract user account data.
 * On success, calls valoStats.js to extract competitive data and display stats.
 */
require("dotenv").config();

const { MessageEmbed } = require('discord.js');

const request = require('request');
const cheerio = require('cheerio');

module.exports = {
  name: 'valo',
  category: 'webscrape',
  description: 'search valo stats, [~valo username tagline]',
  usage: `valo`,
  async execute(message, args, command, client, Discord){

    message.channel.send("Loading search: "+ args.join(" "));
    let accountData = JSON.parse("{}");
    await request("https://api.henrikdev.xyz/valorant/v1/account/"+args.join("/"), (error, response, html) => {
      if (!error && response.statusCode == 200) {
        const $ = cheerio.load(html);
        accountData = JSON.parse($('body').text());
        console.log(accountData);
        if (accountData.status === 404) {
          return message.channel.send("Invalid user " + args.join("#")+". If you have not set your tagline you can do so at https://account.riotgames.com");
        }
        client.commands.get("valoStats").execute(message, args, command, client, Discord, accountData);
      }
    });
    console.log("out");

        

  }
}
      

