//load dependencies
var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");
var moment = require("moment");

//array of links to mapChannels philly venues
var venueArray = [
    "https://events.mapchannels.com/Index.aspx?venue=21825",
    "https://events.mapchannels.com/Index.aspx?venue=14617",
    "https://events.mapchannels.com/Index.aspx?venue=5843",
    "https://events.mapchannels.com/Index.aspx?venue=18688",
    "https://events.mapchannels.com/Index.aspx?venue=19650",
    "https://events.mapchannels.com/Index.aspx?venue=16281",
    "https://events.mapchannels.com/Index.aspx?venue=146",
    "https://events.mapchannels.com/Index.aspx?venue=22309"
];

module.exports = function(app){

    //api route used to scrape mapchannels website
    app.get("/api/scrape", function(req, res) {

        for (var i = 0; i < venueArray.length; i++){
            axios.get(venueArray[i]).then(function(response){
                var $ = cheerio.load(response.data);
                var venue = $('h3[style*="color:green"]').children().text();
                $("tr[itemtype*='http://data-vocabulary.org/Event']").each(function(i, element) {
    
                    var artist = $(element).find("span").text();
                    var eventData = $(element).find("time").attr("datetime");
                    //convert event time to unix for easier sorting
                    eventSplit = eventData.split("T")
                    eventDate = moment(eventSplit[0]).unix();
                    //new event object
                    var newEvent = {
                        eventDate:eventDate,
                        artist:artist,
                        venue:venue
                    }
                    //sent to repeatCheck function to determine if event already stored in db
                    repeatCheck(newEvent);        
                  });
            });
        }
        res.json("scrape completed")
    });

    //route to get event information 
    app.get("/api/events", function(req, res){
        db.EventInfo.find({},[],{
            sort:{
                eventDate:1
            }
        })
        .then(function(dbEvent){
            res.json(dbEvent);
        })
        .catch(function(err){
            res.json(err)
        })
    });

}

//function used to determine if article is already stored in db
function repeatCheck(newEvent){
    var isRepeat = false;

    //goes through all stored articles and checks to see if the title matches
    db.EventInfo.find({}).then(function(dbEvent){
        for (var i = 0; i < dbEvent.length; i++){
            if (dbEvent[i].eventDate == newEvent.eventDate && dbEvent[i].artist == newEvent.artist){
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

//function to delete past events from database
function deletePast(eventArray){
    var currentTime = parseInt(moment().unix());
    for (var i = 0; eventArray.length; i++){
        var eventTime = parseInt(eventArray[i].eventDate);
        if (currentTime > eventTime){
            db.EventInfo.deleteOne({_id:eventArray[i]._id})
        }
    }
    return
}