// dependencies required to run app
const express = require("express");
const fs = require("fs");
const path = require("path");
const uniqid = require("uniqid")

var PORT = process.env.PORT || 3001;
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use(express.static("/public"));


require("./routes/html-routes")(app);
require("./routes/api-routes")(app);

// Starts the server to begin listening
app.listen(PORT, function() {
    console.log("App listening on PORT " + PORT);
});