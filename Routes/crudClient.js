const express = require('express');
const router = express.Router();
const bdd = require('../config/bdd');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const auth = require('../Middleware/auth');

 

//creer Route pour ajouter un client
router.post('/addClient', auth.authentification, async(req,res) => {
    const {name, firstname, email, birthday, address, phone, password} = req.body;

    // const securedPassword = await bcrypt.hash(password, 10);

    const sql = "insert into clients (name, firstname, email, birthday, address, phone, password) values (?,?,?,?,?,?,?);";
    bdd.query(sql,[name, firstname, email, birthday, address, phone, securedPassword], (error,result) => {
        if (error) throw error;
        res.send("Client inscrit")
    });

});

//Creer Route pour lire tous les clients
router.get('/allClient', auth.authentification, (req, res) =>{

//     let sql= "";
//     // si role admin, on peut lire toutes les client, sinon non
// if(req.role == 'admin'){
//     sql = "SELECT * FROM clients LEFT JOIN escapeGames On users.id=tasks.id;";
// }else{
//     sql = "SELECT * FROM clients WHERE idClients =?;";
// }



    const sql = "SELECT * FROM clients";

    bdd.query(sql, (error,result) =>{
        if (error) throw error;
        res.json(result);
    });
});


//Creer Route pour mettre à jour un client
router.post('/updateClient/:id', (req,res) =>{
    const {name, firstname, email, birthday, address, phone, password} = req.body;
    const getUpdate = req.params.id;
    const cryptPassword = bcrypt.hashSync(password,10);
    const sql = "UPDATE clients SET name = ?, firstname = ?, email = ?, birthday = ?, address = ?, phone = ? , password= ? WHERE idClient = ?;";
    bdd.query(sql, [name, firstname, email, birthday, address, phone, cryptPassword , getUpdate], (error, result) => {
        if (error) throw error;
        res.send("Client mis à jour")
        
    });
});

//Route pour supprimer un client
router.delete('/:id', auth.authentification, (req, res) => {
    if(req.role != 'admin') {
    return res.status(401).send('Vous n\'avez pas les droits pour supprimer cet utilisateur');
    }
    const {id} = req.params;
    const sql = 'DELETE FROM clients WHERE id =?';
    bdd.query(sql, [id], (error,result) =>{
        if(error) throw error;
        res.send('Client supprimé');    
      
    });


});


//Route pour se connecter 
router.post('/LoginPage', (req,res) => {
    const {loginEmail, password} = req.body;
    const sql = "select name,firstname, email,password,idClient,role from clients where email like ?;";    
    bdd.query(sql,[loginEmail],async(error, results) => {
        if (error) throw error;
        if (results.length > 0) {
            const user = results[0];
            
        bcrypt.compare(password, user.password, (error, resultat) => {
            if (error) throw error;
            if (resultat) {
                const token = jwt.sign({ idClient: user.id, email : user.email,  role : user.role }, 'secretkey', { expiresIn: '2h' });
                res.json({ token, user });
            } else {
                res.status(401).send('password incorrect');
            }
        });
    } else {
        res.status(404).send('client introuvable');
    }
});
});


//Route pour enregistrer un utilisateur
router.post('/SigninPage', (req,res) => {
    const {name, firstname, birthday, phone, email, password} = req.body;
    const cryptPassword = bcrypt.hashSync(password,10);
    const sql = "insert into clients (name, firstname, birthday, phone, email, password) values (?, ? ,?, ?, ?, ?) ;";
    bdd.query(sql, [name, firstname, birthday, phone, email, cryptPassword, "user"],async(error, result) => {
        if (error) throw error;
        res.send('Client inscrit');
});
});



module.exports = router;