const express = require('express');
const router = express.Router();
const bdd = require('../Config/bdd');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// Ajouter un miniGame
router.post('/addMGame', auth.authentification, (req, res) => {
    const { mgtitle, mgDes, reward } = req.body;
    const addMGame = "INSERT INTO miniGames (mgtitle, mgDes, reward) VALUES (?, ?, ?);";
    bdd.query( addMGame, [mgtitle, mgDes, reward], (error, result) => {
        if (error) {
            return res.status(500).send("Erreur lors de l'ajout du mini game");
        }
        res.send("Le mini game a bien été ajouté");
    })
})

// Modifier un mini game
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


//Afficher un mini game via son id
router.get('/getMGameById/:idMiniGame', auth.authentification, (req, res) => {
    const { idMiniGame } = req.params;
    const getMGameById = "SELECT * FROM miniGames WHERE idMiniGame = ?;";
    bdd.query( getMGameById, [idMiniGame], (error, result) => {
        if (error) throw error;
        res.json(result);
    });
});


// Afficher les mini games si on est admin
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