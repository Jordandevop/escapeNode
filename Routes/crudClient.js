const express = require('express');
const router = express.Router();
const bdd = require('../Config/bdd');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const auth = require('../middleware/auth');

// A ne pas prendre en compte, c'est pour les besoins du crud réservation
router.post('/login', (req, res) => {
    const { email, password} = req.body;
    const loginClient = "SELECT * FROM clients WHERE email = ?;";
    bdd.query ( loginClient, [email], (error, result) => {
        if (error) throw error;
        if (result.length > 0) {
            const client = result[0];
            if (password === client.password) {
                // J'ai dû changer et mettre idClient comme dans notre bdd
                const token = jwt.sign({ id: client.idClient, role: client.role}, 'secretkey', {expiresIn: '3h'});
                console.log(token);
                
                res.json({token});
            } else {
                res.status(401).send('Mot de passe incorrect');
            }
        } else {
            res.status(404).send('Inconnu au bataillon');
        };
    });
});

module.exports = router;