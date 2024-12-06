const jwt = require('jsonwebtoken');

const authentification =(req,res, next) => {
    const token = req.headers['authorization'];
    
    
    if (token) {
        console.log('Token reçu', token);
        jwt.verify(token.split(' ')[1], 'secretkey',(error,decode) =>{
            if (error) {
                console.log('Erreur de verification du token', error);
                return res.status(401).send('token incorrect')        
            } else {
                req.clientId = decode.idClient;
                req.clientEmAil = decode.email;
                req.clientFirstname = decode.firstname;
                req.clientRole = decode.role;
                next ();
            }
        });
   
    } else {
        res.status(401).send('aucun token')
        
    }
};

module.exports = {authentification};