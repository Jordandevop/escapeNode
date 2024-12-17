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

});

// Ajout d'un jeu avec thème et difficulté ok
router.post("/addGame", upload.single("file"), auth.authentification, (req, res) => {
  if (req.clientRole == "admin") {

    const escape = JSON.parse(req.body.escape)
    const tempPath = req.file.path;



    const targetPath = path.join(
      __dirname,
      "../images/" + req.file.originalname
    );
    if (
      path.extname(req.file.originalname).toLowerCase() === ".png" ||
      path.extname(req.file.originalname).toLowerCase() === ".jpg" ||
      path.extname(req.file.originalname).toLowerCase() === ".jpeg" ||
      path.extname(req.file.originalname).toLowerCase() === ".webp"
    ) {
      fs.rename(tempPath, targetPath, (err) => {
        if (err) return handleError(err, res);

        // res.status(200).contentType("text/plain").end("Image chargée!");
      });
    } else {
      fs.unlink(tempPath, (err) => {
        if (err) return handleError(err, res);

        //utile si on souhaite juste inserer des images
        // res
        //   .status(403)
        //   .contentType("text/plain")
        //   .end("Seulement .png, .jpg, webp, .jpeg  sont des fichiers acceptés!");
      });
    }
    const { title, description, duration, price, playersMin, video, home, homeKit, playersMax, finalGoal, idDifficulty, idTheme } = escape;
    console.log(title);

    const addGame = "INSERT INTO escapeGames (title, description, duration, price, playersMin, image, video, home, homeKit, playersMax,finalGoal, idDifficulty) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?);";
    bdd.query(addGame, [title, description, duration, price, playersMin, req.file.originalname, video, home, homeKit, playersMax, finalGoal, idDifficulty], (error, result) => {

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
    const { title, description, duration, price, playersMin, playersMax, image, video, home, homeKit, finalGoal, idTheme } = req.body;
    const { idGame } = req.params;
    const sql = 'update escapeGames SET title = ?, description = ?, duration = ?, price = ?, playersMin = ?, playersMax = ?, image = ?, video = ?, home = ? , homeKit = ?, finalGoal = ? WHERE idGame =?;';
    bdd.query(sql, [title, description, duration, price, playersMin, playersMax, image, video, home, homeKit, idGame], (error, result) => {
      const escapeId = result.insertId;
      const updateEscapeInThemesGames = "UPDATE themesGames SET idGame=?, idTheme=?;";
      bdd.query(updateEscapeInThemesGames, [escapeId, idTheme], (error, result) => {
        if (error) throw error;
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

// Afficher les escape game par id
router.get("/getGamesById/:id", (req, res) => { const id = req.params.id; const getGameById = "SELECT * FROM escapeGames WHERE idGame = ?"; bdd.query(getGameById, [id], (error, result) => { if (error) throw error; res.json(result); }); });


// Afficher les escape games à domicile OK
router.get("/getGamesAtHome", (req, res) => {
  const getGamesAtHome = "SELECT * FROM escapeGames WHERE home=1;";
  bdd.query(getGamesAtHome, (error, result) => {
    if (error) throw error;
    res.json(result);
  });
});
router.get("/getGamesAtHomeById/:id", (req, res) => {
  const id = req.params.id;
  const getGamesAtHome = "SELECT * FROM escapeGames WHERE idGame=? and home=1;";
  bdd.query(getGamesAtHome, [id], (error, result) => {
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

// Afficher le nombre d'escape game
router.get("/getNbGames", (req, res) => {
  const getNbGames = "SELECT COUNT(idGame) AS nombre FROM escapeGames;";
  bdd.query(getNbGames, (error, result) => {
    res.json(result);
  });
});


module.exports = router;
