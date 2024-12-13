const express = require('express');
const router = express.Router();
const bdd = require('../Config/bdd');
const jwt = require('jsonwebtoken');
const auth = require('../Middleware/auth');


// Ajouter un miniGame OK-OK
router.post('/addMGame', auth.authentification, (req, res) => {
    const { mgTitle, mgDes } = req.body;
    let addMGame = "";
    if(req.clientRole == "admin") {
        addMGame = "INSERT INTO miniGames (mgTitle, mgDes) VALUES (?, ?);";
    } else {
        res.send("Vous n'avez pas l'accès");
    }
    bdd.query( addMGame, [mgTitle, mgDes, req.clientRole], (error, result) => {
        if(error) throw error;
        res.send("Mini game ajouté.");
    });
});

// Modifier un mini game OK OK
router.patch('/updateMGame/:idMiniGame', auth.authentification, (req, res) => {
    const { idMiniGame } = req.params;
    const { mgTitle, mgDes } = req.body;
    const updateMGame = "UPDATE miniGames SET mgTitle=?, mgDes=? WHERE idMiniGame=?;";
    bdd.query ( updateMGame, [ mgTitle, mgDes, idMiniGame ], (error, result) => {
        if(error) throw error;
        res.send("Le mini game a bien été modifié.");
    });
});

//Supprimer un mini game OK OK
router.delete('/deleteMGame/:idMiniGame', auth.authentification, (req, res) => {
    const { idMiniGame } = req.params;
    const deleteMGame = "DELETE FROM miniGames WHERE idMiniGame = ?;";
    bdd.query ( deleteMGame, [ idMiniGame], (error, result) => {
        if (error) throw error;
        res.send("Le mini game a bien été supprimé.");
    });
});


//Afficher un mini game via son id OK OK
router.get('/getMGameById/:idMiniGame', auth.authentification, (req, res) => {
    const { idMiniGame } = req.params;
    const getMGameById = "SELECT * FROM miniGames WHERE idMiniGame = ?;";
    bdd.query( getMGameById, [idMiniGame], (error, result) => {
        if (error) throw error;
        res.json(result);
    });
});


// Afficher les mini games si on est admin OK OK
router.get('/getMGameByRole', auth.authentification, (req, res) => {
    let getMGameByRole = "";
    if (req.clientRole == "admin") {
        getMGameByRole = "SELECT * FROM miniGames;";
        bdd.query (getMGameByRole, [req.clientRole], (error, result) => {
            if (error) throw error;
            res.json(result);
        });
    } else {
        res.send("Vous n'êtes pas autorisé à accéder à ces informations.")
    }

});




module.exports = router;