const express = require("express");
const router = express.Router();
const bdd = require("../Config/bdd");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const auth = require("../Middleware/auth");

//creer Route pour ajouter un client
router.post("/addClient", async (req, res) => {
  const { name, firstname, email, birthday, phone, password, createdAt } =
    req.body;
  const securedPassword = await bcrypt.hash(password, 10);
  const sql =
    "insert into clients (name, firstname, email, birthday,  phone, password, createdAt) values (?,?,?,?,?,?, NOW());";
  const checkSql = "SELECT * FROM clients WHERE email=? OR phone=?;";
  bdd.query(checkSql, [email, phone], (error, result) => {
    if (error) throw error;
    if (result.length > 0) {
      res
        .status(401)
        .send(
          "Cet email ou ce numéro de téléphone est déjà utilisé. Veuillez en choisir un autre."
        );
    } else {
      bdd.query(
        sql,
        [name, firstname, email, birthday, phone, securedPassword, createdAt],
        (error, result) => {
          if (error) throw error;
          res.send("Client inscrit");
        }
      );
    }
  });
});

//Route pour afficher soit tous les clients soit les données du client
router.get("/allClient", auth.authentification, (req, res) => {
  let sql = "";
  if (req.clientRole == "admin") {
    sql = "SELECT * FROM clients;";
  } else {
    sql = "SELECT * FROM clients WHERE email = ?;";
  }
  bdd.query(sql, [req.clientEmail, req.clientRole], (error, result) => {
    if (error) throw error;
    res.json(result);
  });
});

//Route pour afficher les clients par id

router.get("/client/:id", auth.authentification, (req, res) => {
  const idClient = req.params.id;
  const getClient = "SELECT * FROM clients WHERE idClient = ?;";
  bdd.query(getClient, [idClient], (error, result) => {
    if (error) throw error;
    res.json(result);
  });
})



//Creer Route pour mettre à jour un client
router.patch("/updateClient", auth.authentification, (req, res) => {
  // if (req.clientRole !== "admin") {
  //   return res.status(401).send("Vous n'avez pas les droits pour modifier cet utilisateur");
  // }
  const { name, firstname, email, birthday, address, phone, password } =
    req.body;


  if (!email) {
    return res.status(400).json({ message: "Email requis pour identifier le client." });
  }
  const cryptPassword = bcrypt.hashSync(password, 10);
  const updateClient =
    "UPDATE clients SET name = ?, firstname = ?, email = ?, birthday = ?, address = ?, phone = ? , password= ? WHERE email = ?;";
  bdd.query(
    updateClient,
    [
      name,
      firstname,
      email,
      birthday,
      address,
      phone,
      cryptPassword,
      req.clientEmail,
    ],
    (error, result) => {
      if (error) throw error;
      res.json(result);
    }
  );
});

//Route pour supprimer un client
router.delete("/delete/:idClient", auth.authentification, (req, res) => {
  if (req.clientRole != "admin") {
    return res
      .status(401)
      .send("Vous n'avez pas les droits pour supprimer cet utilisateur");
  }
  const { idClient } = req.params;
  const sql = "DELETE FROM clients WHERE idClient =?;";
  bdd.query(sql, [idClient], (error, result) => {
    if (error) throw error;
    res.send("Client supprimé");
  });
});

//Route pour se connecter
router.post("/LoginPage", (req, res) => {
  const { email, password } = req.body;
  const sql = "SELECT * from clients where email = ?;";
  bdd.query(sql, [email], async (error, results) => {
    if (error) throw error;
    if (results.length > 0) {
      const client = results[0];
      bcrypt.compare(password, client.password, (error, resultat) => {
        if (error) throw error;
        if (resultat) {
          const token = jwt.sign(
            {
              email: client.email,
              prenom: client.firstname,
              role: client.role,
            },
            "secretkey",
            { expiresIn: "2h" }
          );
          res.json({ token });
        } else {
          res.status(401).send("password incorrect");
        }
      });
    } else {
      res.status(404).send("client introuvable");
    }
  });
});

module.exports = router;
