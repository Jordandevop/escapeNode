const jwt = require("jsonwebtoken");

//authentification avec token

const authentification = (req, res, next) => {
  const token = req.headers["authorization"];

  if (token) {
    jwt.verify(token.split(" ")[1], "secretkey", (error, decode) => {
      if (error) {
        console.log("Erreur de vérification du token:", error);
        console.log(token);
        return res.status(401).send("token incorrect");
      } else {
        req.clientId = decode.idClient;
        req.clientEmail = decode.email;
        req.clientFirstname = decode.firstname;
        //ajout de la gestion des role
        req.clientRole = decode.role;

        next();
      }
    });
  } else {
    res.status(401).send("token manquant");
  }
};

module.exports = { authentification };
