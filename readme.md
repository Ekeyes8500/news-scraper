# The Philly Music Scraper

![Scraper](https://imgur.com/a/IJL8WMF)

# Introduction
Welcome to the Philly Music Scraper! This is a web scraper that pulls from a specially curated list of Philadelphia venues to find some of the best underground/indie acts that come through the city of Philadelphia! Users are welcome to add comments on any event they see fit. Traditionally, updates to this system would come from a "cron"-type operation, but Heroku proves unreliable for this, so press the button below to clean out old events and get new ones!

## Features

#### Scrapes the following venues for show data
 1. The Fillmore
 2. Kung Fu Necktie
 3. Johnny Brenda's
 4. MilkBoy Philly
 5. The Boot & Saddle
 6. Union Transfer
 7. Theatre Of The Living Arts
 8. The Foundry

#### Search for tickets function
* Allows users to search for show tickets through sarcastic means using string concatenation! Basically, the app parses together the various keywords that were scraped and brings up a link to the famous LMGTFY website!

#### Comments
* Users can post comments on the various shows simply by clicking the "comments" button and adding what they have to say!


## Tech stack

#### Front End
1. Handlebars is used as the view engine for the front end

#### Back End
1. Axios is used to scrape venue data by looping through an array of ticket selling pages

2. Cheerio is used to grab the data from the page, returning it to the database

3. Mongo/Mongoose is used to store the scraped data and user comments

4. Moment is used to parse dates into unix and back, allowing for easy sorting and deletion

5. Express is used to put it all together through routes!




##### Thank you checking out the Philly Music scraper!