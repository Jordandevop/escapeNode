const express = require('express');
const router = express.Router();
const bdd = require('../Config/bdd');
const jwt = require('jsonwebtoken');
const auth = require('../Middleware/auth');

// Ajouter un résultat si c'est gagné OK OK
router.post('/addReward', (req, res) => {
    const { idResult, typeReward } = req.body;
    const addReward = "INSERT INTO rewards (idResult, typeReward, dateReward) VALUES (?, ?, now());";
    bdd.query(addReward, [idResult, typeReward], (error, result) => {
        if (error) throw error;
        res.send("La récompense a été ajoutée.");
    });
});

// Modifier une récompense par admin uniquement OK OK
router.patch('/updateReward/:idReward', auth.authentification, (req, res) => {
    const { idReward } = req.params;
    const { typeReward } = req.body;
    if (req.clientRole == "admin") {
        const updateReward = "UPDATE rewards SET typeReward=? WHERE idReward=?;";
        bdd.query(updateReward, [ typeReward, idReward], (error, result) => {
            if (error) throw error;
            res.send("Récompense modifée.");
        });
    } else {
        res.send("Vous n'avez pas les droits.");
    };
});

// Supprimer une récompense que si on est admin OK OK
router.delete('/deleteReward/:idReward', auth.authentification, (req, res) => {
    const { idReward } = req.params;
    if (req.clientRole == "admin") {
        const deleteReward = "DELETE FROM rewards WHERE idReward=?;";
        bdd.query (deleteReward, [idReward], (error, result) => {
            if (error) throw error;
            res.send("Récompense supprimée.");
        });
    } else {
        res.send("Vous n'avez pas les droits.");
    };
});


//  Afficher les récompenses OK OK
router.get('/getReward', auth.authentification, (req, res) => {
    let getReward = "";
    if (req.clientRole == "admin") {
        getReward = "SELECT clients.name, miniGames.mgTitle, mgResults.score, mgResults.playedAt, rewards.typeReward, rewards.dateReward FROM clients INNER JOIN mgResults ON mgResults.idClient=clients.idClient INNER JOIN miniGames ON miniGames.idMiniGame = mgResults.idMiniGame INNER JOIN rewards ON rewards.idResult=mgResults.idResult;";
    } else {
        getReward = "SELECT clients.name, miniGames.mgTitle, mgResults.score, mgResults.playedAt, rewards.typeReward, rewards.dateReward FROM clients INNER JOIN mgResults ON mgResults.idClient=clients.idClient INNER JOIN miniGames ON miniGames.idMiniGame = mgResults.idMiniGame INNER JOIN rewards ON rewards.idResult=mgResults.idResult WHERE clients.email=?;"
    }
    bdd.query (getReward, [req.clientEmail], (error, result) => {
        if (error) throw error;
        res.json(result);
    });
});

// Afficher le délai entre l'envoi de la récompense et maintenant OK OK
router.get('/getRewardByTime', auth.authentification, (req, res) => {
    let getRewardByTime = "";
    if (req.clientRole == "admin") {
        getRewardByTime = "SELECT clients.name, clients.firstname, miniGames.mgTitle, miniGames.idMiniGame, mgResults.score, mgResults.playedAt, rewards.typeReward, rewards.dateReward, DATEDIFF(now(), dateReward) FROM clients INNER JOIN mgResults ON mgResults.idClient=clients.idClient INNER JOIN miniGames ON miniGames.idMiniGame = mgResults.idMiniGame INNER JOIN rewards ON rewards.idResult=mgResults.idResult;";
    } else {
        getRewardByTime = "SELECT clients.name, clients.firstname, miniGames.mgTitle, miniGames.idMiniGame, mgResults.score, mgResults.playedAt, rewards.typeReward, rewards.dateReward, DATEDIFF(now(), dateReward) FROM clients INNER JOIN mgResults ON mgResults.idClient=clients.idClient INNER JOIN miniGames ON miniGames.idMiniGame = mgResults.idMiniGame INNER JOIN rewards ON rewards.idResult=mgResults.idResult WHERE clients.email=?;"
    }
    bdd.query (getRewardByTime, [req.clientEmail], (error, result) => {
        if (error) throw error;
        res.json(result);
    });
}) ;

module.exports = router;