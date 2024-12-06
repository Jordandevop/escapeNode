const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const bdd = require("./config/bdd");
const cors = require("cors");

const crudClient = require("./routes/crudClient");

app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

app.use("/client", crudClient);
app.listen(process.env.PORT || 3000, () => {
  console.log("Bienvenue sur le port 3000");
});
