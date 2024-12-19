const express = require('express');
const router = express.Router();
const bdd = require('../Config/bdd');
const jwt = require('jsonwebtoken');
const auth = require('../Middleware/auth');

// Ajouter une réservation OK :
router.post('/addBooking', (req, res) => {
    const { idClient, idGame, date, time, nbPlayers, totalPrice, event } = req.body;
    const addBooking = "INSERT INTO booking (idClient, idGame, date, time, nbPlayers, totalPrice, event) VALUES (?, ?, ?, ?, ?, ?, ?);";    
    bdd.query (addBooking, [idClient, idGame, date, time, nbPlayers, totalPrice, event], (error, result) => {
        if(error) {
            console.log(error);
            return res.status(500).send("Erreur lors de l'ajout de la réservation");

            
        }
        res.send("La réservation a bien été ajoutée");
    });
});

// Voir si on peut ajouter une réservation avec idClient par son mail, en créant une constante id ?

// Modifier une réservation OK
router.patch('/updateBooking/:idBooking', (req, res) => {
    const { idBooking } = req.params;
    const { idClient, idGame, date, time, nbPlayers, totalPrice, event } = req.body;
    const updateBooking = "UPDATE booking SET idClient=?, idGame=?, date=?, time=?, nbPlayers=?, totalPrice=?, event=? WHERE idBooking = ?;";

    bdd.query ( updateBooking, [ idClient, idGame, date, time, nbPlayers, totalPrice, event, idBooking ], (error, result) => {
        if (error) throw error;
        res.send("Réservation modifiée");
    });
});

// Supprimer une réservation OK
router.delete('/deleteBooking/:idBooking', (req, res) => {
    const { idBooking } = req.params;
    const deleteBooking = "DELETE FROM booking WHERE idBooking = ?;";
    bdd.query ( deleteBooking, [ idBooking ], (error, result) => {
        if (error) throw error;
        res.send("Réservation supprimée");
    });
});


// Afficher les réservations en fonction du rôle et du client OK
router.get('/getBookingByRole', auth.authentification, (req, res) => {
    let getBooking = "";
    if (req.clientRole == "admin") {
        getBooking = "SELECT booking.idClient, booking.idGame, escapeGames.title, booking.date, booking.time, booking.nbPlayers, booking.totalPrice, booking.event FROM booking INNER JOIN clients ON clients.idClient = booking.idClient INNER JOIN escapeGames ON escapeGames.idGame = booking.idGame;";
    } else {
        getBooking = "SELECT booking.idClient, booking.idGame, escapeGames.title, booking.date, booking.time, booking.nbPlayers, booking.totalPrice, booking.event FROM booking INNER JOIN clients ON clients.idClient = booking.idClient INNER JOIN escapeGames ON escapeGames.idGame = booking.idGame WHERE clients.email=?;";
    }
    bdd.query(getBooking, [req.clientEmail], (error, result) => {
      
        if (error) throw error;
        res.json (result);    
    });
});

// Afficher le nombre de résa sur un même escape game OK
router.get('/getBookingByIdGame/:idGame', (req, res) => {
    const { idGame } = req.params;
    const getBookingByIdGame = "SELECT escapeGames.title, COUNT(booking.idBooking) FROM booking INNER JOIN escapeGames ON escapeGames.idGame = booking.idGame WHERE booking.idGame = ?;";
    bdd.query(getBookingByIdGame, [idGame], (error, result) => {
        if (error) throw error;
        res.json(result);
    });
});

// Afficher toutes les résa par escape game OK (inutile)
router.get('/getAllBookingByGame', auth.authentification, (req, res) => {
    const getAllBookingByGame = "SELECT booking.date, booking.time, escapeGames.title, booking.idBooking FROM booking INNER JOIN escapeGames ON escapeGames.idGame = booking.idGame ORDER BY escapeGames.title;";
    bdd.query(getAllBookingByGame, (error, result) => {
        if (error) throw error;
        res.json(result);
    });
});

// Afficher les resa par date et par game OK (inutile)
router.get('/getAllBookingByDateByGame', auth.authentification, (req, res) => {
    const getAllBookingByDateByGame = "SELECT booking.date, booking.time, escapeGames.title, booking.idBooking FROM booking INNER JOIN escapeGames ON escapeGames.idGame = booking.idGame ORDER BY booking.date, escapeGames.title;";
    bdd.query(getAllBookingByDateByGame, (error, result) => {
        if (error) throw error;
        res.json(result);
    });
});

// Afficher les résa sur une date donnée OK
router.get('/getAllBookingByDate', auth.authentification, (req, res) => {
    const { date } = req.body;
    const getAllBookingByDate = "SELECT booking.date, booking.time, escapeGames.title, booking.idBooking FROM booking INNER JOIN escapeGames ON escapeGames.idGame = booking.idGame WHERE booking.date = ?;";
    bdd.query(getAllBookingByDate, [ date ], (error, result) => {
        if (error) throw error;
        res.json(result);
    });
});

// Afficher le nombre de résa par game OK (inutile)
router.get('/getNbBookingByGame', auth.authentification, (req, res) => {
    const getNbBookingByGame = "SELECT booking.date, booking.time, escapeGames.title, COUNT(booking.idBooking) FROM booking INNER JOIN escapeGames ON escapeGames.idGame = booking.idGame GROUP BY escapeGames.title;";
    bdd.query(getNbBookingByGame, (error, result) => {
        if (error) throw error;
        res.json(result);
    });
});

// Afficher le nb de résa en fonction du client OK
router.get('/getNbBookingByClient', auth.authentification, (req, res) => {
    const getNbBookingByClient = "SELECT COUNT(booking.idBooking), clients.name FROM booking INNER JOIN clients ON clients.idClient = booking.idClient WHERE clients.email = ?;";
    bdd.query( getNbBookingByClient, [req.clientEmail], (error, result) => {
        if (error) throw error;
        res.json(result);
    } );
});

// Afficher le nombre de toutes les résa par date OK (inutile)
router.get('/getAllBookingByDate', (req, res) => {
    const getAllBookingByDate = "SELECT booking.date, booking.time, escapeGames.title, COUNT(booking.idBooking) FROM booking INNER JOIN escapeGames ON escapeGames.idGame = booking.idGame GROUP BY booking.date;";
    bdd.query(getAllBookingByDate, (error, result) => {
        if (error) throw error;
        res.json (result);
    });
});

// Afficher le nombre de joueurs par résa OK
router.get('/getNbPlayersByBooking/:idBooking', auth.authentification, (req, res) => {
    const { idBooking } = req.params;
    const getNbPlayersByBooking = "SELECT nbPlayers FROM booking WHERE idBooking=?;";
    bdd.query(getNbPlayersByBooking, [ idBooking ], (error, result) => {
        if (error) throw error;
        res.json(result);
    });
});




module.exports = router;