const express = require('express');
const router = express.Router();
const bdd = require('../Config/bdd');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

//Ajouter un résultat à la main si on est admin
router.post('/addResult', auth.authentification, (req, res) => {
    let addResult = "";
    const { idClient, idMiniGame, score, playedAt } = req.body;
    if(req.clientRole == "admin") {
        addResult = "INSERT INTO mgResults (idClient, idMiniGame, score, playedAt) VALUES (?, ?, ?, ?);";
    } else {
        res.send("Vous n'êtes pas autorisé à accéder à cette fonction.");
    }
    bdd.query (addResult, [ idClient, idMiniGame, score, playedAt, req.clientRole ], (error, result) => {
        if (error) throw error;
        res.send("Résutat ajouté.");
    });
});

// Modifier un résultat si on est admin
router.patch('/updateResult/:idResult', auth.authentification, (req, res) => {
    const { idResult } = req.params;
    const { idClient, idMiniGame, score, playedAt  } = req.body;
    let updateResult = "";
    if (req.clientRole == "admin") {
        updateResult = "UPDATE mgResults SET idClient=?, idMiniGame=?, score=?, playedAt=? WHERE idResult=?;";
    } else {
        res.send("Vous n'êtes pas autorisé à accéder à cette fonction.");
    }
    bdd.query ( updateResult, [idClient, idMiniGame, score, playedAt, idResult], (error, result) => {
        if (error) throw error;
        res.send("Résultat modifié.");
    });
});

// Supprimer un résultat si on est admin
router.delete('/deleteResult/:idResult', auth.authentification, (req, res) => {
    const { idResult } = req.params;
    let deleteResult = "";
    if (req.clientRole == "admin") {
        deleteResult = "DELETE from mgResults WHERE idResult=?;";
    } else {
        res.send("Vous n'êtes pas autorisé à accéder à cette fonction.");
    }
    bdd.query ( deleteResult, [idResult], (error, result) => {
        if(error) throw error;
        res.send("Résultat supprimé");
    });
});

// Afficher les résultats en fonction du client
router.get('/getResultByIdClient', auth.authentification, (req, res) => {
    const getResultByIdClient = "SELECT mgResults.idResult, mgResults.idMiniGame, mgResults.score, mgResults.playedAt, miniGames.mgTitle, miniGames.reward FROM mgResults INNER JOIN miniGames ON miniGames.idMiniGame = mgResults.idMiniGame WHERE idClient = ?;";
    bdd.query ( getResultByIdClient, [req.idClient], (error, result) => {
        if (error) throw error;
        res.json(result);
    });
});


// Afficher tous les résultats si on est admin
router.get('/getResultByRole', auth.authentification, (req, res) => {
    let getResultByRole = "";
    if ( req.clientRole == "admin") {
        getResultByRole = "SELECT mgResults.idResult, mgResults.idMiniGame, mgResults.score, mgResults.playedAt, miniGames.mgTitle, miniGames.reward FROM mgResults INNER JOIN miniGames ON miniGames.idMiniGame = mgResults.idMiniGame;";
    } else {
        res.send ("Vous n'avez pas les droits admin.")
    }
    bdd.query (getResultByRole, [req.clientRole], (error, result) => {
        if (error) throw error;
        res.json(result);
    });
});



module.exports = router;