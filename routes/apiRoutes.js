//load dependencies
var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

module.exports = function(app){

    //api route used to scrape npr website
    app.get("/api/scrape", function(req, res) {

        axios.get("https://www.npr.org/sections/news/").then(function(response) {

            var $ = cheerio.load(response.data);
          
            $(".respArchListImg").each(function(i, element) {
                var result = {};
                result.title = $(element).attr("alt");
                result.link = $(element).parent().attr("href");
                //sent to repeatCheck function, which finds if article already in db
                repeatCheck(result);
          
            });
          });
        res.send("scrape completed")
    })

}

//function used to determine if article is already stored in db
function repeatCheck(newEvent){
    var isRepeat = false;

    //goes through all stored articles and checks to see if the title matches
    db.EventInfo.find({}).then(function(dbEvent){
        for (var i = 0; i < dbEvent.length; i++){
            if (dbEvent[i].name == newEvent.name){
                isRepeat = true;
            }
        }
        if (isRepeat === true){
            console.log("REPEAT EVENT, NOT ADDING TO DB");
        } else if (isRepeat === false){
            db.EventInfo.create(newEvent)
            .catch(function(err){
                return res.json(err);
            })
        }
    });
}