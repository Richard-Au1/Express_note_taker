// dependecies
const fs = require("fs");

// 
var data = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));

module.exports = function(app) {
    // sends user data from the notes.
    app.get("/api/notes", function(req, res) {
       
        res.json(data);

    });
    // route to the ids of each note
    app.get("/api/notes/:id", function(req, res) {

        res.json(data[Number(req.params.id)]);

    });
    // route to notes
    app.post("/api/notes", function(req, res) {

        // gives each note a id to display on the page
        let newNote = req.body;
        let uniqueId = (data.length).toString();
        console.log(uniqueId);
        newNote.id = uniqueId;
        data.push(newNote);

        fs.writeFileSync("./db/db.json", JSON.stringify(data), function(err) {
            if (err) throw (err);        
        }); 

        res.json(data);    

    });
    // allows the user to delete their notes.
    app.delete("/api/notes/:id", function(req, res) {

        let noteId = req.params.id;
        let newId = 0;
        console.log(`Deleting note with id ${noteId}`);
        data = data.filter(currentNote => {
           return currentNote.id != noteId;
        });
        for (currentNote of data) {
            currentNote.id = newId.toString();
            newId++;
        }
        fs.writeFileSync("./db/db.json", JSON.stringify(data));
        res.json(data);
    }); 

}