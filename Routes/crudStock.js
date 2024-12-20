const express = require('express');
const router = express.Router();
const bdd = require('../Config/bdd');
const auth = require('../Middleware/auth');

// Ajouter du stock en fonction de l'idGame
router.post('/addStock', auth.authentification, (req, res) => {
    const { idGame, stock, taxDelivery } = req.body;
    let addStock = "";
    if (req.clientRole == "admin") {
        addStock = "INSERT INTO stock (idGame, stock, taxDelivery) VALUES (?, ?, ?);";
    } else {
        res.send("Vous n'avez pas les droits admin.");
    }
    bdd.query(addStock, [idGame, stock, taxDelivery], (error, result) => {
        if (error) throw error;
        res.send("Les infos stock ont été ajoutées.");
    });
});

// Modifier les infos stock si on est admin en fonction de l'idDelivery
router.patch('/updateStock/:idDelivery', auth.authentification, (req, res) => {
    const { idDelivery } = req.params;
    const { idGame, stock, taxDelivery } = req.body;
    let updateStock = "";
    if (req.clientRole == "admin") {
        updateStock = "UPDATE stock SET idGame=?, stock=?, taxDelivery=? WHERE idDelivery=?;";
    } else {
        res.send("Vous n'avez pas les droits admin.");
    }
    bdd.query(updateStock, [idGame, stock, taxDelivery, idDelivery], (error, result) => {
        if (error) throw error;
        res.send("Les infos stock ont été modifées.");
    });
});


// Supprimer les infos stock par rapport à l'idDelivery
router.delete('/deleteStock/:idDelivery', auth.authentification, (req, res) => {
    const { idDelivery } = req.params;
    let deleteStock = "";
    if (req.clientRole == "admin") {
        deleteStock = "DELETE from stock WHERE idDelivery=?;";
    } else {
        res.send("Vous n'avez pas les droits admin.");
    }
    bdd.query(deleteStock, [idDelivery], (error, result) => {
        if (error) throw error;
        res.send("Les infos stock ont été supprimées.");
    });
});

//  Afficher les infos stock si on est admin
router.get('/getStock', auth.authentification, (req, res) => {
    let getStock = "";
    if (req.clientRole == "admin") {
        getStock = "SELECT stock.idDelivery, stock.idGame, stock.stock, stock.taxDelivery, escapeGames.title, escapeGames.description FROM stock INNER JOIN escapeGames ON escapeGames.idGame = stock.idGame;";
    } else {
        res.send("Vous n'avez pas les droits.");
    }
    bdd.query(getStock, [req.clientRole], (error, result) => {
        if (error) throw error;
        res.json(result);
    });
});


module.exports = router;