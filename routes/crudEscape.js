const express = require('express');
const router = express.Router();
const bdd = require('../config/bdd');
const jwt = require('jsonwebtoken');
const auth = require('../Middleware/auth');

//Route pour créer un nouvel Escape
router.post('/addEscape', auth.authentification, (req, res) => {
    const { title, description, duration, price, players, image, video, home, homeKit } = req.body; 
    const sql = 'INSERT INTO escapeGames (title, description, duration, price, players, image, video, home, homeKit) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)'
    bdd.query(sql, [title, description, duration, price, players, image, video, home, homeKit], (error, result) => {
        if (error) throw error;
        res.send("Escape Game ajoutée")
    });
});

//Route pour lire tous les Escapes
router.get('/allEscape', auth.authentification, (req, res) =>{
    let sql= "";
    // si role admin, on peut lire toutes les tâches, sinon on ne peut lire que les tâches de son utilisateur
if(req.role == 'admin'){
    sql = "SELECT * FROM escapeGames LEFT JOIN clients On users.id=escape.id;";
}else{
    sql = "SELECT * FROM escapeGames WHERE idGame =?;";
}

    bdd.query(sql, (error,result) =>{
        if (error) throw error;
        res.json(result);
    });
});


//Creer Route pour mettre à jour un Escape
router.post('/updateEscape/:id', auth.authentification,(req,res) =>{
    const { title, description, duration, price, players, image, video, home, homeKit } = req.body; 
    const getUpdate = req.params.id;
    const sql = 'update escapeGames SET title = ?, description = ?, duration = ?, price = ?, players = ?, image = ?, video = ?, home = ? , homeKit = ? WHERE idGame =?'
    bdd.query(sql, [title, description, duration, price, players, image, video, home, homeKit , getUpdate], (error, result) => {
        if (error) throw error;
        res.send(" Escape mis à jour")
        
    });
});

//Creer Route pour supprimer un client
router.delete('/deleteEscape/:id', auth.authentification, (req,res) => {
    const id = parseInt(req.params.id);
    const sql = 'DELETE FROM escapeGames WHERE idGame = ?;';
    bdd.query(sql, [id], (error,result) =>{
        if(error) throw error;
        res.send("Escape supprimé")
    });
});

module.exports = router;