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
  dest: "../uploads",
});



// Route pour servir une image spécifique
router.get("/images/:imageName", (req, res) => {
  res.sendFile(path.join(__dirname, "../uploads/images/" + req.params.imageName));

});

//Route pour afficher une videos specifique
router.get("/videos/:videoName", (req, res) => {
  res.sendFile(path.join(__dirname, "../uploads/videos/" + req.params.videoName))
})

// Ajout d'un jeu avec thème et difficulté ok
router.post("/addGame", upload.fields([{ name: 'file' }, { name: 'video' }]), auth.authentification, (req, res) => {
  if (req.clientRole == "admin") {


    const escape = JSON.parse(req.body.escape)
    // Vérification et déplacement des fichiers
    const imageFile = req.files && req.files.file ? req.files.file[0] : null;
    const videoFile = req.files && req.files.video ? req.files.video[0] : null;



    if (imageFile && (path.extname(imageFile.originalname).toLowerCase() === ".png" || path.extname(imageFile.originalname).toLowerCase() === ".jpg")) {
      const targetPath = path.join(__dirname, "../uploads/images/" + imageFile.originalname);
      fs.rename(imageFile.path, targetPath, err => {
        if (err) return handleError(err, res);
      });
    } else if (imageFile) {
      fs.unlink(imageFile.path, err => {
        if (err) return handleError(err, res);
        return res.status(403).contentType("text/plain").end("Only .png, .jpg files are allowed for images!");
      });
    }

    if (videoFile && (path.extname(videoFile.originalname).toLowerCase() === ".mp4")) {
      const targetPath = path.join(__dirname, "../uploads/videos/" + videoFile.originalname);
      fs.rename(videoFile.path, targetPath, err => {
        if (err) return handleError(err, res);
      });
    } else if (videoFile) {
      fs.unlink(videoFile.path, err => {
        if (err) return handleError(err, res);
        return res.status(403).contentType("text/plain").end("Only .mp4 files are allowed for videos!");
      });
    }
    const { title, description, duration, price, playersMin, home, homeKit, playersMax, finalGoal, idDifficulty, idTheme } = escape;


    const addGame = "INSERT INTO escapeGames (title, description, duration, price, playersMin, image, video, home, homeKit, playersMax,finalGoal, idDifficulty) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?,?);";
    console.log(imageFile.originalname);
    const nameImg = imageFile ? imageFile.originalname : '';
    const nameVideo = videoFile ? videoFile.originalname : '';


    bdd.query(addGame, [title, description, duration, price, playersMin, nameImg, nameVideo, home, homeKit, playersMax, finalGoal, idDifficulty], (error, result) => {
<<<<<<< HEAD

      // if (error) {res.send("Il y a eu une erreur lors de la modif de l'escape game")}
      if(error) {
        res.send("Une erreur est survenue lors de la modification de l'escape game.")
      }
=======
      // if (error) {res.send('erreur lors de la creation de l escape game' )}

>>>>>>> ac691ff2d3e7b70505b5ea75bbcf5564b08de536
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
router.patch('/updateEscape/:idGame', upload.fields([{ name: 'file' }, { name: 'video' }]), auth.authentification, (req, res) => {
  if (req.clientRole === "admin") {
    const escape = JSON.parse(req.body.escape)
    const imageFile = req.files.file ? req.files.file[0] : null;
    const videoFile = req.files.video ? req.files.video[0] : null;


    if (imageFile && (path.extname(imageFile.originalname).toLowerCase() === ".png" || path.extname(imageFile.originalname).toLowerCase() === ".jpg")) {
      const targetPath = path.join(__dirname, "../uploads/images/" + imageFile.originalname);
      fs.rename(imageFile.path, targetPath, err => {
        if (err) return handleError(err, res);
      });
    } else if (imageFile) {
      fs.unlink(imageFile.path, err => {
        if (err) return handleError(err, res);
        return res.status(403).contentType("text/plain").end("Only .png, .jpg files are allowed for images!");
      });
    }

    if (videoFile && (path.extname(videoFile.originalname).toLowerCase() === ".mp4")) {
      const targetPath = path.join(__dirname, "../uploads/videos/" + videoFile.originalname);
      fs.rename(videoFile.path, targetPath, err => {
        if (err) return handleError(err, res);
      });
    } else if (videoFile) {
      fs.unlink(videoFile.path, err => {
        if (err) return handleError(err, res);
        return res.status(403).contentType("text/plain").end("Only .mp4 files are allowed for videos!");
      });
    }


    const { title, description, duration, price, playersMin, playersMax, home, homeKit, finalGoal, idTheme } = escape;

    const { idGame } = req.params;

    const sql = 'update escapeGames SET title = ?, description = ?, duration = ?, price = ?, playersMin = ?, playersMax = ?, image = ?, video = ?, home = ? , homeKit = ?, finalGoal = ? WHERE idGame =?;';
    const nameImg = imageFile ? imageFile.originalname : '';
    const nameVideo = videoFile ? videoFile.originalname : '';
    bdd.query(sql, [title, description, duration, price, playersMin, playersMax, nameImg, nameVideo, home, homeKit, finalGoal, idGame], (error, result) => {
      console.log(error);

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
