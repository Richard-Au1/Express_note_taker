// dependencies required to run app
const express = require("express");
const fs = require("fs");

var app =  express();
var PORT = process.env.PORT || 3001;

app.use(express.urlencoded({extended: true}))
app.use(express.json());
app.use("/public/assets", express.static(__dirname + "/public/assets"));


require("./routes/html-routes")(app);
require("./routes/api-routes")(app);

// Starts the server to begin listening
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});