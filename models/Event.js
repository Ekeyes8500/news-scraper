//model for an event found by the scraper
var mongoose = require("mongoose");

var Schema = mongoose.Schema;


var EventSchema = new Schema({

    name: {
        type: String,
        required: true
    },
    venue:{
        type: String,
        required: true
    },
    date:{
        type: String,
        required: true
    },
    comments: [
        {
            type: Schema.Types.ObjectId,
            ref: "Comment"
        }
    ]
});

var EventInfo = mongoose.model("Event", EventSchema);

module.exports = EventInfo;