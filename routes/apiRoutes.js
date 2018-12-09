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
function repeatCheck(newArticle){
    var isRepeat = false;

    //goes through all stored articles and checks to see if the title matches
    db.Article.find({}).then(function(dbArticle){
        for (var i = 0; i < dbArticle.length; i++){
            if (dbArticle[i].title == newArticle.title){
                isRepeat = true;
            }
        }
        if (isRepeat === true){
            console.log("is a repeat, not adding to db");
        } else if (isRepeat === false){
            db.Article.create(newArticle)
            .catch(function(err){
                return res.json(err);
            })
        }
    });
}