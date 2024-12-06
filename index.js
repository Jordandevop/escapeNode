const express = require('express');
const app = express();
const bodyParser = require("body-parser");
const crudClient = require('./Routes/crudClient')
const cors = require("cors");


app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/client", crudClient);




app.listen(process.env.PORT || 3000,() => {
    console.log("Bienvenue sur le port 3000");
    
})