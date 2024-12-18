const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const bdd = require("./Config/bdd");
const cors = require("cors");
const crudClient = require("./Routes/crudClient");
const crudEscape = require("./Routes/crudEscape");
const crudBooking = require("./Routes/crudBooking");
const crudMGame = require("./Routes/crudMGame");
const crudResults = require("./Routes/crudResult");
const crudStock = require("./Routes/crudStock");
const crudReward = require("./Routes/crudReward");
const crudTheme = require("./Routes/crudTheme");
const crudDifficulty = require("./Routes/crudDifficulty");
const crudPromo = require("./Routes/crudPromo");

app.use(bodyParser.json());
app.use(cors());
app.use(express.json());

app.use("/client", crudClient);
app.use("/escape", crudEscape);
app.use("/booking", crudBooking);
app.use("/mgame", crudMGame);
app.use("/Result", crudResults);
app.use("/Stock", crudStock);
app.use("/reward", crudReward);
app.use("/theme", crudTheme);
app.use("/difficulty", crudDifficulty);
app.use("/promo", crudPromo);

app.listen(process.env.PORT || 3000, () => {
  console.log("Bienvenue sur le port 3000");
});
