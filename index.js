const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const crudClient = require('./Routes/crudClient')
const cors = require("cors");
const crudBooking = require('./Routes/crudBooking')


app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/client", crudClient);

// Ajout route pour booking et escape
app.use("/booking", crudBooking);




app.listen(process.env.PORT || 3000,() => {
    console.log("Bienvenue sur le port 3000");
    
})