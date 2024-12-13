const express = require("express");
const router = express.Router();
const bdd = require('../Config/bdd');
const jwt = require('jsonwebtoken');
const auth = require('../Middleware/auth');
const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Gestion des erreurs
const handleError = (err, res) => {
  res
    .status(500)
    .contentType("text/plain")
    .end("Oops! Quelque chose ne c'est pas bien passé!");
};

//Configuration de multer pour upload
const upload = multer({
  dest: "../images",
});

// Route pour servir une image spécifique
router.get("/images/:imageName", (req, res) => {
  res.sendFile(path.join(__dirname, "../images/" + req.params.imageName));
  // console.log(imagePath);
});

// Ajout d'un jeu avec thème et difficulté ok
router.post("/addGame", upload.single("file"), auth.authentification, (req, res) => {
  if (req.clientRole == "admin") {
    const tempPath = req.file.path;
      const targetPath = path.join(
        __dirname,
        "../images/" + req.file.originalname
      );
      if (
        path.extname(req.file.originalname).toLowerCase() === ".png" ||
        path.extname(req.file.originalname).toLowerCase() === ".jpg" ||
        path.extname(req.file.originalname).toLowerCase() === ".webp"
      ) {
        fs.rename(tempPath, targetPath, (err) => {
          if (err) return handleError(err, res);

          res.status(200).contentType("text/plain").end("Image chargée!");
        });
      } else {
        fs.unlink(tempPath, (err) => {
          if (err) return handleError(err, res);

          res
            .status(403)
            .contentType("text/plain")
            .end("Seulement .png, .jpg sont des fichiers acceptés!");
        });
      }
    const { title, description, duration, price, playersMin, image, video, home, homeKit, playersMax, idDifficulty, idTheme } = req.body;
    const addGame = "INSERT INTO escapeGames (title, description, duration, price, playersMin, image, video, home, homeKit, playersMax, idDifficulty) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
    bdd.query(addGame, [title, description, duration, price, playersMin, image, video, home, homeKit, playersMax, idDifficulty], (error, result) => {

      const idEscape = result.insertId;
      const addGameInThemesGames = "INSERT INTO themesGames (idGame, idTheme) VALUES (?, ?);";

      bdd.query(addGameInThemesGames, [idEscape, idTheme], (error, result) => {
      });
      if (error) throw error;
      res.send("L'escape game a été ajouté.");
    });
  } else {
    res.send("Vous n'avez pas les droits.");
  };
});

//Route pour lire tous les Escapes
router.get('/allEscape', (req, res) => {
  const sql = "SELECT * FROM escapeGames;";
  bdd.query(sql, (error, result) => {
    if (error) throw error;
    res.json(result);
  });
});

//Mettre à jour un Escape game
router.post('/updateEscape/:idGame', auth.authentification, (req, res) => {
  if (req.clientRole === "admin") {
    const { title, description, duration, price, playersMin, playersMax, image, video, home, homeKit, idTheme } = req.body;
    const { idGame } = req.params;
    const sql = 'update escapeGames SET title = ?, description = ?, duration = ?, price = ?, playersMin = ?, playersMax = ?, image = ?, video = ?, home = ? , homeKit = ? WHERE idGame =?;';
    bdd.query(sql, [title, description, duration, price, playersMin, playersMax, image, video, home, homeKit, idGame], (error, result) => {
      const escapeId=result.insertId;
      const updateEscapeInThemesGames = "UPDATE themesGames SET idGame=?, idTheme=?;";
      bdd.query(updateEscapeInThemesGames, [escapeId, idTheme], (error, result) => {
        if(error) throw error;
        res.send("L'escape game a été modifié.");
      });
    });
  } else {
    res.send("Vous ne pouvez pas modifier d'escape game.")
  }
});

//Creer Route pour supprimer un escapeGame
router.delete('/deleteEscape/:idGame', auth.authentification, (req, res) => {
  if (req.clientRole != "admin") {
    return res.status(401).send("Vous n'avez pas les droits pour supprimer cet escape game.")
  }
  const { idGame } = req.params;
  const sql = 'DELETE FROM escapeGames WHERE idGame = ?;';
  bdd.query(sql, [idGame], (error, result) => {
    if (error) throw error;
    res.send("Escape supprimé")
  });
});

// Afficher les escape game sur place OK
router.get("/getGames", (req, res) => {
  const getGames = "SELECT * FROM escapeGames WHERE home=0;";
  bdd.query(getGames, (error, result) => {
    if (error) throw error;
    res.json(result);
  });
});

// Afficher les escape games à domicile OK
router.get("/getGamesAtHome", (req, res) => {
  const getGamesAtHome = "SELECT * FROM escapeGames WHERE home=1;";
  bdd.query(getGamesAtHome, (error, result) => {
    if (error) throw error;
    res.json(result);
  });
});


// Afficher les escape games par thème
router.get("/getGamesByTheme/:idTheme", (req, res) => {
  const { idTheme } = req.params;
  const getGamesByTheme = "SELECT escapeGames.idGame, escapeGames.title, themes.topic FROM escapeGames INNER JOIN themesGames ON themesGames.idGame = escapeGames.idGame INNER JOIN themes ON themes.idTheme=themesGames.idTheme WHERE themes.idTheme=?;";
  bdd.query(getGamesByTheme, [idTheme], (error, result) => {
    if (error) throw error;
    res.json(result);
  });
});

// Afficher les escape game par difficulté
router.get("/getGamesByDifficulty/:idDifficulty", (req, res) => {
  const { idDifficulty } = req.params;
  const getGamesByDifficulty = "SELECT escapeGames.idGame, escapeGames.title, difficulties.level FROM escapeGames INNER JOIN difficulties ON difficulties.idDifficulty=escapeGames.idDifficulty WHERE difficulties.idDifficulty=?;";
  bdd.query(getGamesByDifficulty, [idDifficulty], (error, result) => {
    if (error) throw error;
    res.json(result);
  });
});


module.exports = router;
