const express = require('express');
const router = express.Router();
const bdd = require('../Config/bdd');
const jwt = require('jsonwebtoken');
const auth = require('../Middleware/auth');

// ERREUR !!
//Ajouter un résultat à la main si on est admin, j'ai ajouté le now et sendReward OK
// router.post('/addResult', auth.authentification, (req, res) => {
//     let addResult = "";
//     const { idClient, idMiniGame, score } = req.body;
//     if(req.clientRole == "admin") {
//         addResult = "INSERT INTO mgResults (idClient, idMiniGame, score, playedAt, sendReward) VALUES (?, ?, ?, now(), now());";
//     } else {
//         res.send("Vous n'êtes pas autorisé à accéder à cette fonction.");
//     }
//     bdd.query (addResult, [ idClient, idMiniGame, score, req.clientRole ], (error, result) => {
//         if (error) throw error;
//         res.send("Résultat ajouté.");
//     });
// });

// Ajout du résultat après avoir joué OK OK
router.post('/addResult', (req, res) => {
    const { idClient, idMiniGame, score } = req.body;
    const addResult = "INSERT INTO mgResults (idClient, idMiniGame, score, playedAt) VALUES (?, ?, ?, now());";
    bdd.query(addResult, [idClient, idMiniGame, score], (error, result) => {
        if (error) throw error;
        res.send("Résultat ajouté.");
    });
});

// Modifier un résultat si on est admin, j'ai ajouté le now et enlevé playedAt OK OK
router.patch('/updateResult/:idResult', auth.authentification, (req, res) => {
    const { idResult } = req.params;
    const { idClient, idMiniGame, score } = req.body;
    let updateResult = "";
    if (req.clientRole == "admin") {
        updateResult = "UPDATE mgResults SET idClient=?, idMiniGame=?, score=? WHERE idResult=?;";
        bdd.query(updateResult, [idClient, idMiniGame, score, idResult], (error, result) => {
            if (error) throw error;
            res.send("Résultat modifié.");
        });
    } else {
        res.send("Vous n'êtes pas autorisé à accéder à cette fonction.");
    }
});

// Supprimer un résultat si on est admin OK OK
router.delete('/deleteResult/:idResult', auth.authentification, (req, res) => {
    const { idResult } = req.params;
    let deleteResult = "";
    if (req.clientRole == "admin") {
        deleteResult = "DELETE from mgResults WHERE idResult=?;";
        bdd.query(deleteResult, [idResult], (error, result) => {
            if (error) throw error;
            res.send("Résultat supprimé");
        });
    } else {
        res.send("Vous n'êtes pas autorisé à accéder à cette fonction.");
    }

});

// Afficher les résultats et les dates en fonction du client OK OK
router.get('/getResult', auth.authentification, (req, res) => {
    let getResultByIdClient = "";
    if (req.clientRole == "admin") {
        getResultByIdClient = "SELECT mgResults.idResult, mgResults.idMiniGame, mgResults.score, mgResults.playedAt, miniGames.mgTitle FROM mgResults INNER JOIN miniGames ON miniGames.idMiniGame = mgResults.idMiniGame INNER JOIN clients ON clients.idClient = mgResults.idClient;";
    } else {
        getResultByIdClient = "SELECT mgResults.idResult, mgResults.idMiniGame, mgResults.score, mgResults.playedAt, miniGames.mgTitle FROM mgResults INNER JOIN miniGames ON miniGames.idMiniGame = mgResults.idMiniGame INNER JOIN clients ON clients.idClient = mgResults.idClient WHERE clients.email = ?;";
    }
    bdd.query(getResultByIdClient, [req.clientEmail], (error, result) => {
        if (error) throw error;
        res.json(result);
    });
});


// Afficher le temps écoulé entre maintenant et le moment où un client a joué (pas avant 1 semaine) OK
router.get('/getTimeParty', auth.authentification, (req, res) => {
    let getTimeParty = "";
    if (req.clientRole === "admin") {
        getTimeParty = "SELECT clients.idClient, clients.name, clients.firstname, miniGames.idMiniGame, miniGames.mgTitle, mgResults.playedAt, DATEDIFF(now(), playedAt) FROM clients INNER JOIN mgResults ON mgResults.idClient = clients.idClient INNER JOIN miniGames ON miniGames.idMiniGame = miniGames.idMiniGame;";
    } else {
        getTimeParty = "SELECT clients.idClient, clients.name, clients.firstname, miniGames.idMiniGame, miniGames.mgTitle, mgResults.playedAt, DATEDIFF(now(), playedAt) FROM clients INNER JOIN mgResults ON mgResults.idClient = clients.idClient INNER JOIN miniGames ON miniGames.idMiniGame = miniGames.idMiniGame WHERE clients.email=?;"
    }
    bdd.query(getTimeParty, [req.clientRole, req.clientEmail], (error, result) => {
        if (error) throw error;
        res.json(result);
    });
});


module.exports = router;