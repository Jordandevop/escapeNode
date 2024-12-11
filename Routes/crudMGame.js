const express = require('express');
const router = express.Router();
const bdd = require('../Config/bdd');
const jwt = require('jsonwebtoken');
const auth = require('../Middleware/auth');


// Ajouter un miniGame OK
router.post('/addMGame', auth.authentification, (req, res) => {
    const { mgTitle, mgDes, reward } = req.body;
    let addMGame = "";
    if(req.clientRole == "admin") {
        addMGame = "INSERT INTO miniGames (mgTitle, mgDes, reward) VALUES (?, ?, ?);";
    } else {
        res.send("Vous n'avez pas l'accès");
    }
    bdd.query( addMGame, [mgTitle, mgDes, reward, req.clientRole], (error, result) => {
        if(error) throw error;
        console.log(error);
        
        res.send("Mini game ajouté.");
    });
});

// Modifier un mini game OK
router.patch('/updateMGame/:idMiniGame', auth.authentification, (req, res) => {
    const { idMiniGame } = req.params;
    const { mgTitle, mgDes, reward } = req.body;
    const updateMGame = "UPDATE miniGames SET mgTitle=?, mgDes=?, reward=? WHERE idMiniGame=?;";
    bdd.query ( updateMGame, [ mgTitle, mgDes, reward, idMiniGame ], (error, result) => {
        if(error) throw error;
        res.send("Le mini game a bien été modifié.");
    });
});

//Supprimer un mini game
router.delete('/deleteMGame/:idMiniGame', auth.authentification, (req, res) => {
    const { idMiniGame } = req.params;
    const deleteMGame = "DELETE FROM miniGames WHERE idMiniGame = ?;";
    bdd.query ( deleteMGame, [ idMiniGame], (error, result) => {
        if (error) throw error;
        res.send("Le mini game a bien été supprimé.");
    });
});


//Afficher un mini game via son id OK
router.get('/getMGameById/:idMiniGame', auth.authentification, (req, res) => {
    const { idMiniGame } = req.params;
    const getMGameById = "SELECT * FROM miniGames WHERE idMiniGame = ?;";
    bdd.query( getMGameById, [idMiniGame], (error, result) => {
        if (error) throw error;
        res.json(result);
    });
});


// Afficher les mini games si on est admin OK
router.get('/getMGameByRole', auth.authentification, (req, res) => {
    let getMGameByRole = "";
    if (req.clientRole == "admin") {
        getMGameByRole = "SELECT * FROM miniGames;";
    } else {
        res.send("Vous n'êtes pas autorisé à accéder à ces informations.")
    }
    bdd.query (getMGameByRole, [req.clientRole], (error, result) => {
        if (error) throw error;
        res.json(result);
    });
});



module.exports = router;