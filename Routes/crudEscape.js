const express = require("express");
const router = express.Router();
const bdd = require("../Config/bdd");
const jwt = require("jsonwebtoken");
const auth = require("../Middleware/auth");
const multer = require("multer");
const path = require("path");
const fs = require("fs");

//gestion des erreurs
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

//Ajout du playersMin et playersMax
//Route pour créer un nouvel Escape
router.post(
  "/addEscape",
  upload.single("file"),
  auth.authentification,
  (req, res) => {
    if (req.clientRole === "admin") {
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

      const {
        title,
        description,
        duration,
        price,
        playersMin,
        image,
        video,
        home,
        homeKit,
        playersMax,
      } = req.body;
      const sql =
        "INSERT INTO escapeGames (title, description, duration, price, playersMin, image, video, home, homeKit, playersMax) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);";
      bdd.query(
        sql,
        [
          title,
          description,
          duration,
          price,
          playersMin,
          image,
          video,
          home,
          homeKit,
          playersMax,
          req.clientRole,
        ],
        (error, result) => {
          if (error) throw error;
          res.send("Escape Game ajoutée");
        }
      );
    } else {
      res.send("Vous n'avez pas les droits");
    }
  }
);

//Route pour lire tous les Escapes en salle
router.get("/allEscape", (req, res) => {
  const sql = "SELECT * FROM escapeGames where home=0;";
  bdd.query(sql, (error, result) => {
    if (error) throw error;
    res.json(result);
  });
});

//Route pour lire les escape a domicile
router.get("/allEscapeHome", (req, res) => {
  const sql = "SELECT * FROM escapeGames where home=1;";
  bdd.query(sql, (error, result) => {
    if (error) throw error;
    res.json(result);
  });
});

// Ajout de playersMin et playersMax et modification de req.params.id en req.params
//Creer Route pour mettre à jour un Escape
router.post("/updateEscape/:idGame", auth.authentification, (req, res) => {
  if (req.clientRole === "admin") {
    const {
      title,
      description,
      duration,
      price,
      playersMin,
      playersMax,
      image,
      video,
      home,
      homeKit,
    } = req.body;
    const { idGame } = req.params;
    const sql =
      "update escapeGames SET title = ?, description = ?, duration = ?, price = ?, playersMin = ?, playersMax = ?, image = ?, video = ?, home = ? , homeKit = ? WHERE idGame =?";
    bdd.query(
      sql,
      [
        title,
        description,
        duration,
        price,
        playersMin,
        playersMax,
        image,
        video,
        home,
        homeKit,
        idGame,
      ],
      (error, result) => {
        if (error) throw error;
        res.send(" Escape mis à jour");
      }
    );
  } else {
    res.send("Vous ne pouvez pas modifier d'escape game.");
  }
});

// Ajout d'un admin ?
//Creer Route pour supprimer un escapeGame
router.delete("/deleteEscape/:idGame", auth.authentification, (req, res) => {
  if (req.clientRole != "admin") {
    return res
      .status(401)
      .send("Vous n'avez pas les droits pour supprimer cet escape game.");
  }
  const { idGame } = req.params;
  const sql = "DELETE FROM escapeGames WHERE idGame = ?;";
  bdd.query(sql, [idGame], (error, result) => {
    if (error) throw error;
    res.send("Escape supprimé");
  });
});

module.exports = router;
