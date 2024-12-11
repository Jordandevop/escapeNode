const express = require('express');
const router = express.Router();
const bdd = require('../Config/bdd');
const jwt = require('jsonwebtoken');
const auth = require('../Middleware/auth');

//Ajout du playersMin et playersMax
//Route pour créer un nouvel Escape
router.post('/addEscape', auth.authentification, (req, res) => {
    if( req.clientRole === "admin") {
        const { title, description, duration, price, playersMin, image, video, home, homeKit, playersMax } = req.body;
        const sql = 'INSERT INTO escapeGames (title, description, duration, price, playersMin, image, video, home, homeKit, playersMax) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';
        bdd.query(sql, [title, description, duration, price, playersMin, image, video, home, homeKit, playersMax, req.clientRole], (error, result) => {
            if (error) throw error;
            res.send("Escape Game ajoutée")
        });
    } else {
        res.send("Vous n'avez pas les droits")
    }     
});

//Route pour lire tous les Escapes
router.get('/allEscape', (req, res) => {
    const sql = "SELECT * FROM escapeGames;";
    bdd.query(sql, (error, result) => {
        if (error) throw error;
        res.json(result);
    });
});

// Ajout de playersMin et playersMax et modification de req.params.id en req.params
//Creer Route pour mettre à jour un Escape
router.post('/updateEscape/:idGame', auth.authentification, (req, res) => {
    if (req.clientRole === "admin") {
        const { title, description, duration, price, playersMin, playersMax, image, video, home, homeKit } = req.body;
        const { idGame } = req.params;
        const sql = 'update escapeGames SET title = ?, description = ?, duration = ?, price = ?, playersMin = ?, playersMax = ?, image = ?, video = ?, home = ? , homeKit = ? WHERE idGame =?'
        bdd.query(sql, [title, description, duration, price, playersMin, playersMax, image, video, home, homeKit, idGame], (error, result) => {
            if (error) throw error;
            res.send(" Escape mis à jour")
        });
    }else {
        res.send("Vous ne pouvez pas modifier d'escape game.")
    } 
});

// Ajout d'un admin ?
//Creer Route pour supprimer un escapeGame
router.delete('/deleteEscape/:idGame', auth.authentification, (req, res) => {
    if (req.clientRole != "admin") {
        return res.status(401).send("Vous n'avez pas les droits pour supprimer cet escape game.")
    }
    const {idGame} = req.params;
    const sql = 'DELETE FROM escapeGames WHERE idGame = ?;';
    bdd.query(sql, [idGame], (error, result) => {
        if (error) throw error;
        res.send("Escape supprimé")
    });
});

module.exports = router;