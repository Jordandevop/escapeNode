const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const crudClient = require('./Routes/crudClient')
const cors = require("cors");

// Ajouter mes imports 
const crudBooking = require('./Routes/crudBooking');
const crudMGame = require('./Routes/crudMGame');
const crudResults = require('./Routes/crudResult');
const crudStock = require('./Routes/crudStock');


app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/client", crudClient);

// Ajout route pour booking et miniGames
app.use("/booking", crudBooking);
app.use("/MGame", crudMGame);
app.use('/Result', crudResults);
app.use('/Stock', crudStock);




app.listen(process.env.PORT || 3000,() => {
    console.log("Bienvenue sur le port 3000");
    
})