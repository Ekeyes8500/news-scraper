var db = require("../models");
var moment = require("moment");
module.exports = function (app) {

    app.get("/", function (req, res){
        db.EventInfo.find({},[],{
            sort:{
                eventDate:1
            }
        })
        .then(function(dbEvent){
            var eventObj = {
                events:[]
            }
            for (var i = 0; i < dbEvent.length; i++){
                var thisEvent = dbEvent[i];
                console.log(thisEvent);
                var newDate = moment.unix(thisEvent.eventDate).format("MMMM DD");
                var newObject = {
                    venue: thisEvent.venue,
                    artist: thisEvent.artist,
                    eventDate: newDate,
                    comments: thisEvent.comments
                }
                eventObj.events.push(newObject);
            }
            if (dbEvent.length === eventObj.events.length){
                res.render("index", eventObj);
            }
            
        })
        .catch(function(err){
            res.json(err)
        })
    });
}