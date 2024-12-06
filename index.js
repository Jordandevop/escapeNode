const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const bdd = require('./config/bdd');
const cors = require('cors');
const crudClient = require('./Routes/crudClient');
const crudEscape = require('./Routes/crudEscape'); 
const crudBooking = require('./Routes/crudBooking');
const crudMGame = require('./Routes/crudMGame');




app.use(bodyParser.json());
app.use(cors());
app.use(express.json());


app.use('/client', crudClient);
app.use('/escape', crudEscape);
app.use('/booking', crudBooking);
app.use('/mgame', crudMGame);


app.listen(process.env.PORT || 3000, () => {
    console.log("je suis sur le port 3000");
});

