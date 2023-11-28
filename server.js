// dependencies required to run app
const express = require("express");
const fs = require("fs");
const path = require("path");
const uniqid = require("uniqid")

var PORT = process.env.PORT || 3001;
// create new app
const app = express();
// middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}))

app.use(express.static("/public/assets/js/index.js"));
// sends back index.htmls
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "public/assets/index.html"))
);
// sends back notes.html
app.get("/notes", (req, res) =>
  res.sendFile(path.join(__dirname, "public/assets/notes.html"))
);
app.get('/css/styles.css', (req, res) => {
    res.sendFile(path.join(__dirname, "public/assets/css/styles.css"), {
      headers: {
        'Content-Type': 'text/css',
      },
    });
  });
// reads the db.json file and changes it to json data.
app.get("/api/notes", function (req, res) {
    fs.readFile("db/db.json", "utf8", (err, data) => {
      var jsonData = JSON.parse(data);
      console.log(jsonData);
      res.json(jsonData);
    });
  });

  const readAppendToJson = (content, file) => {
    fs.readFile(file, "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        const parsedData = JSON.parse(data);
        parsedData.push(content);
        writeNewNoteToJson(file, parsedData);
      }
    });
  };

  const writeNewNoteToJson = (destination, content) =>
  fs.writeFile(destination, JSON.stringify(content, null, 3), (err) =>
    err ? console.error(err) : console.info(`\nData written to ${destination}`)
  );

  app.post("/api/notes", (req, res) => {
    const { title, text } = req.body;
    if (title && text) {
      const newNote = {
        title: title,
        text: text,
        id: uniqid(),
      };
  
      readAppendToJson(newNote, "db/db.json");
      const response = {
        status: "success",
        body: newNote,
      };
  
      res.json(response);
    } else {
      res.json("Error in posting new note");
    }
  });

  app.delete("/api/notes/:id", (req, res) => {
    let id = req.params.id;
    let parsedData;
    fs.readFile("db/db.json", "utf8", (err, data) => {
      if (err) {
        console.error(err);
      } else {
        parsedData = JSON.parse(data);
        const filterData = parsedData.filter((note) => note.id !== id);
        writeNewNoteToJson("db/db.json", filterData);
      }
    });
    res.send(`Deleted note with ${req.params.id}`);
  });

// Starts the server to begin listening
app.listen(PORT, function() {
    console.log(`App listening at http://localhost:${PORT}`);
});