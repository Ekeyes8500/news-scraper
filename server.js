var express = require("express");
var exphbs = require("express-handlebars");
var mongoose = require("mongoose");
var app = express();
var db = require("./models");
var PORT = process.env.PORT || 3000;

// Configure middleware

// Parse request body as JSON
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Make public a static folder
app.use(express.static("public"));

// Connect to the Mongo DB
var MONGODB_URI = process.env.MONGODB_URI || "mongodb://localhost/mongoEvents";

mongoose.connect(MONGODB_URI);

app.engine(
    "handlebars",
    exphbs({
        defaultLayout: "main"
    })
);
app.set("view engine", "handlebars");

// Routes
require("./routes/apiRoutes")(app);
require("./routes/htmlRoutes")(app);

app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
});

module.exports = app;
