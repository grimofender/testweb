const express = require("express");
const path = require("path")
const app = express();


app.get("/", (req, res) => res.sendFile(path.join(__dirname + '/source/root.html')));
app.get("/monster", (req, res) => res.sendFile(path.join(__dirname + '/source/monster.html')));
app.get("/game", (req, res) => res.sendFile(path.join(__dirname + '/source/game.html')));

app.use('/public', express.static('public'));
app.listen(process.env.PORT || 3000);