const express = require('express');
const router = express.Router();
const bdd = require('../Config/bdd');
const jwt = require('jsonwebtoken');
const auth = require('../Middleware/auth');

// Ajouter des thèmes OK
router.post("/addTheme", auth.authentification, (req, res) => {
    const { topic } = req.body;
    if(req.clientRole == "admin") {
        const addTheme = "INSERT INTO themes (topic) VALUES (?);";
        bdd.query(addTheme, [ topic, req.clientRole], (error, result) => {
            if (error) throw error;
            res.send("Thème ajouté.");
        });
    } else {
        res.send("Vous n'avez pas les droits.");
    };
});

// Modifier thème OK
router.patch("/updateTheme/:idTheme", auth.authentification, (req, res) => {
    const { idTheme } = req.params;
    const { topic } = req.body;
    if (req.clientRole == "admin") {
        const updateTheme = "UPDATE themes SET topic=? WHERE idTheme=?;";
        bdd.query(updateTheme, [topic, idTheme, req.clientRole], (error, result) => {
            if (error) throw error;
            res.send("Le thème a bien été modifié.");
        });
    } else { 
        res.send("Vous n'avez pas les droits.");
    };
});

// Afficher les thèmes OK
router.get("/getAllThemes", auth.authentification, (req, res) => {
    if (req.clientRole == "admin") {
        const getAllThemes = "SELECT * FROM themes;";
        bdd.query(getAllThemes, [ req.clientRole], (error, result) => {
            if (error) throw error;
            res.json(result);
        });
    } else {
        res.send("Vous n'avez pas les droits.");
    };
});

// Supprimer un thème OK
router.delete("/deleteTheme/:idTheme", auth.authentification, (req, res) => {
    const { idTheme } = req.params;
    if (req.clientRole == "admin") {
        const deleteTheme = "DELETE FROM themes WHERE idTheme=?;";
        bdd.query(deleteTheme, [ idTheme, req.clientRole], (error, result) => {
            if(error) throw error;
            res.send("Thème supprimé.");
        });
    } else {
        res.send("Vous n'avez pas les droits.");
    };
});

// Afficher les thèmes et le nombre de jeux dans chaque thème
router.get("/getNbGamesByTheme", (req, res) => {
    const getNbGamesByTheme = "SELECT themes.topic, count(escapeGames.idGame) AS nombre FROM themes LEFT JOIN themesGames ON themesGames.idTheme = themes.idTheme LEFT JOIN escapeGames ON escapeGames.idGame = themesGames.idGame GROUP BY themes.idTheme;";
    bdd.query (getNbGamesByTheme, (error, result) => {
        if (error) throw error;
        res.json(result);
    });
});


module.exports = router;