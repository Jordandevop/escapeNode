const express = require('express');
const router = express.Router();
const bdd = require('../Config/bdd');
const jwt = require('jsonwebtoken');
const auth = require('../Middleware/auth');

// Ajouter une difficulté OK
router.post("/addDifficulty", auth.authentification, (req, res) => {
    const { level, levelDes } = req.body;
    if (req.clientRole == "admin") {
        const addDifficulty = "INSERT INTO difficulties (level, levelDes) VALUES (?, ?);";
        bdd.query(addDifficulty, [level, levelDes, req.clientRole], (error, result) => {
            if (error) throw error;
            res.send("La difficulté a été ajoutée.");
        });
    } else {
        res.send("Vous n'avez pas les droits.");
    };
});

// Afficher les niveaux de difficulté avec leurs escape game OK
router.get("/getAllDifficulties", (req, res) => {
    const getAllDifficulties = "SELECT difficulties.idDifficulty, difficulties.level, difficulties.levelDes, escapeGames.idGame, escapeGames.title FROM difficulties INNER JOIN escapeGames ON escapeGames.idGame=difficulties.idGame;";
    bdd.query(getAllDifficulties, (error, result) => {
        if (error) throw error;
        res.json(result);
    });
});

// Modifier l'intitulé de la difficulté OK
router.patch("/updateDifficulty/:idDifficulty", auth.authentification, (req, res) => {
    const { idDifficulty } = req.params;
    const { level, levelDes } = req.body;
    if (req.clientRole == "admin") {
        const updateDifficulty = "UPDATE difficulties SET level=?, levelDes=? WHERE idDifficulty=?;";
        bdd.query(updateDifficulty, [level, levelDes, idDifficulty], (error, result) => {
            if (error) throw error;
            res.send("L'intitulé de la difficulté a été modifié.");
        });
    } else {
        res.send("Vous n'avez pas les droits.");
    };
});

// Supprimer un niveau de difficulté OK
router.delete("/deleteDifficulty/:idDifficulty", auth.authentification, (req, res) => {
    const { idDifficulty } = req.params;
    if (req.clientRole == "admin") {
        const deleteDifficulty = "DELETE FROM difficulties WHERE idDifficulty=?;";
        bdd.query(deleteDifficulty, [idDifficulty], (error, result) => {
            if (error) throw error;
            res.send("Le niveau de la difficulté a été supprimé.");
        });
    } else {
        res.send("Vous n'avez pas les droits.");
    };
});

// Afficher les difficultés
router.get("/getDifficulties", (req, res) => {
    const getDifficulties = "SELECT difficulties.level, count(escapeGames.idGame) AS nombre FROM escapeGames RIGHT JOIN difficulties ON difficulties.idDifficulty = escapeGames.idDifficulty GROUP BY difficulties.idDifficulty;";
    bdd.query(getDifficulties, (error, result) => {
        if (error) throw error;
        res.json(result);
    });
});








// Afficher tous les escapeGames en fonction de la difficulté
// Afficher tous les escapeGames en fonction du thème

module.exports = router;