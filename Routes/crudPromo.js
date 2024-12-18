const express = require("express");
const router = express.Router();
const bdd = require("../Config/bdd");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../Middleware/auth");


//route pour ajouter un code promo 
router.post("/addPromo", auth.authentification, (req, res) => {
    const { code_value, created_at, expiration_date, is_used } = req.body;
    if (req.clientRole == "admin") {
        const sql = "INSERT INTO promo (code_value, created_at, expiration_date, is_used) VALUES (?,?,?,?);";
        bdd.query(sql, [code_value, created_at, expiration_date, is_used, req.clientRole], (error, result) => {
            if(error) throw error;
            res.send("Code promo a été ajoutée.");
        });
    } else {
        res.send("Vous n'avez pas les droits.");
    };
});


//route pour lire tous les codes promo

router.get("/getAllPromos", auth.authentification, (req, res) => {
    if (req.clientRole == "admin") {
        const sql = "SELECT * FROM promo;";
        bdd.query(sql, (error, result) => {
            if(error) throw error;
            res.send(result);
        });
    } else {
        res.send("Vous n'avez pas les droits.");
    };
});


//route pour mettre a jour les codes promos

router.put("/updatePromo/:id", auth.authentification, (req, res) => {
    const { id} = req.params;
    const { code_value, created_at, expiration_date, is_used } = req.body;
    if (req.clientRole == "admin") {
        const sql = "UPDATE promo SET code_value=?, created_at=?, expiration_date=?, is_used=? WHERE id=?;";
        bdd.query(sql, [code_value, created_at, expiration_date, is_used, id, req.clientRole], (error, result) => {
            if(error) throw error;
            res.send("Code promo a été modifiée.");
        });
    } else {
        res.send("Vous n'avez pas les droits.");
    };
});

//route pour supprimer un code promo    

router.delete("/deletePromo/:id", auth.authentification, (req, res) => {
    const { id } = req.params;
    if (req.clientRole == "admin") {
        const sql = "DELETE FROM promo WHERE id=?;";
        bdd.query(sql, [id, req.clientRole], (error, result) => {
            if(error) throw error;
            res.send("Code promo a été supprimée.");
        });
    } else {
        res.send("Vous n'avez pas les droits.");
    };
});



module.exports =  router;