const express = require('express');
const router = express.Router();
const bdd = require('../Config/bdd');
const jwt = require('jsonwebtoken');
const auth = require('../middleware/auth');

// Ajouter une réservation :
router.post('/addBooking', auth.authentification, (req, res) => {
    const { idGame, date, time, nbPlayers, totalPrice, event } = req.body;
    const addBooking = "INSERT INTO booking (idClient, idGame, date, time, nbPlayers, totalPrice, event) VALUES (?, ?, ?, ?, ?, ?, ?);";
    console.log(addBooking);
    
    bdd.query (addBooking, [req.idClient, idGame, date, time, nbPlayers, totalPrice, event], (error, result) => {
        if(error) {
            return res.status(500).send("Erreur lors de l'ajout de la réservation");
        }
        res.send("La réservation a bien été ajoutée");
    });
});

// Modifier une réservation
router.patch('/updateBooking/:idBooking', auth.authentification, (req, res) => {
    const { idBooking } = req.params;
    const { idClient, idGame, date, time, nbPlayers, totalPrice, event } = req.body;
    const updateBooking = "UPDATE booking SET idClient=?, idGame=?, date=?, time=?, nbPlayers=?, totalPrice=?, event=? WHERE idBooking = ?;";

    bdd.query ( updateBooking, [ idClient, idGame, date, time, nbPlayers, totalPrice, event, idBooking ], (error, result) => {
        if (error) throw error;
        res.send("Réservation modifiée");
    });
});

// Supprimer une réservation
router.delete('/deleteBooking/:idBooking', auth.authentification, (req, res) => {
    const { idBooking } = req.params;
    const deleteBooking = "DELETE FROM booking WHERE idBooking = ?;";

    bdd.query ( deleteBooking, [ idBooking ], (error, result) => {
        if (error) throw error;
        res.send("Réservation supprimée");
    });
});

// Afficher les réservations en fonction du rôle et du client
router.get('/getBookingByRole', auth.authentification, (req, res) => {
    let getBooking = "";
    if (req.clientRole == "admin") {
        getBooking = "SELECT booking.idClient, booking.idGame, booking.date, booking.time, booking.nbPlayers, booking.totalPrice, booking.event, clients.name, clients.firstname, clients.email, clients.birthday, clients.address, clients.phone, clients.role, escapeGames.title, escapeGames.description, escapeGames.duration, escapeGames.price, escapeGames.players, escapeGames.image, escapeGames.video, escapeGames.home, escapeGames.homeKit FROM booking INNER JOIN escapeGames ON escapeGames.idGame = booking.idGame INNER JOIN clients ON clients.idClient = booking.idClient;";

    } else {
        getBooking = "SELECT booking.idClient, booking.idGame, booking.date, booking.time, booking.nbPlayers, booking.totalPrice, booking.event, clients.name, clients.firstname, clients.email, clients.birthday, clients.address, clients.phone, clients.role, escapeGames.title, escapeGames.description, escapeGames.duration, escapeGames.price, escapeGames.players, escapeGames.image, escapeGames.video, escapeGames.home, escapeGames.homeKit FROM booking INNER JOIN escapeGames ON escapeGames.idGame = booking.idGame INNER JOIN clients ON clients.idClient = booking.idClient WHERE booking.idClient=?;";
    }
    bdd.query ( getBooking, [req.clientRole], (error, result) => {
        if (error) throw error;
        res.json (result);
        console.log(clientId);     
    });
});

// Afficher les résa sur un même escape game
router.get('/getBookingByIdGame/:idGame', auth.authentification, (req, res) => {
    const { idGame } = req.params;
    const getBookingByIdGame = "SELECT escapeGames.title, COUNT(booking.idBooking) FROM booking INNER JOIN escapeGames ON escapeGames.idGame = booking.idGame WHERE booking.idGame = ?;";
    bdd.query(getBookingByIdGame, [idGame], (error, result) => {
        if (error) throw error;
        res.json(result);
    });
});

// Afficher toutes les résa par escape game
router.get('/getAllBookingByGame', auth.authentification, (req, res) => {
    const getAllBookingByGame = "SELECT booking.date, booking.time, escapeGames.title, booking.idBooking FROM booking INNER JOIN escapeGames ON escapeGames.idGame = booking.idGame ORDER BY escapeGames.title;";
    bdd.query(getAllBookingByGame, (error, result) => {
        if (error) throw error;
        res.json(result);
    });
});

// Afficher les resa par date et par game
router.get('/getAllBookingByDateByGame', auth.authentification, (req, res) => {
    const getAllBookingByDateByGame = "SELECT booking.date, booking.time, escapeGames.title, booking.idBooking FROM booking INNER JOIN escapeGames ON escapeGames.idGame = booking.idGame ORDER BY booking.date, escapeGames.title;";
    bdd.query(getAllBookingByDateByGame, (error, result) => {
        if (error) throw error;
        res.json(result);
    });
});

// Afficher les résa sur une date donnée
router.get('/getAllBookingByDate', auth.authentification, (req, res) => {
    const { date } = req.body;
    const getAllBookingByDate = "SELECT booking.date, booking.time, escapeGames.title, booking.idBooking FROM booking INNER JOIN escapeGames ON escapeGames.idGame = booking.idGame WHERE booking.date = ?;";
    bdd.query(getAllBookingByDate, [ date ], (error, result) => {
        if (error) throw error;
        res.json(result);
    });
});

// Afficher le nombre de résa par game
router.get('/getNbBookingByGame', auth.authentification, (req, res) => {
    const getNbBookingByGame = "SELECT booking.date, booking.time, escapeGames.title, COUNT(booking.idBooking) FROM booking INNER JOIN escapeGames ON escapeGames.idGame = booking.idGame GROUP BY escapeGames.title;";
    bdd.query(getNbBookingByGame, (error, result) => {
        if (error) throw error;
        res.json(result);
    });
});

// Afficher le nb de résa en fonction du client
router.get('/getNbBookingByClient', auth.authentification, (req, res) => {
    const getNbBookingByClient = "SELECT COUNT(booking.idBooking), clients.name FROM booking INNER JOIN clients ON clients.idClient = booking.idClient WHERE clients.email = ?;";
    bdd.query( getNbBookingByClient, [req.clientEmail], (error, result) => {
        if (error) throw error;
        res.json(result);
    } );
});

// Afficher le nombre de résa par date
router.get('/getAllBookingByDate', auth.authentification, (req, res) => {
    const getAllBookingByDate = "SELECT booking.date, booking.time, escapeGames.title, COUNT(booking.idBooking) FROM booking INNER JOIN escapeGames ON escapeGames.idGame = booking.idGame GROUP BY booking.date;";
    bdd.query(getAllBookingByDate, (error, result) => {
        if (error) throw error;
        res.json (result);
    });
});

// Afficher le nombre de joueurs par résa
router.get('/getNbPlayersByBooking', auth.authentification, (req, res) => {
    const getNbPlayersByBooking = "SELECT booking.idBooking, booking.nbPlayers FROM booking;";
    bdd.query(getNbPlayersByBooking, (error, result) => {
        if (error) throw error;
        res.json(result);
    });
});

// Afficher le prix total, le score et le reward par résa
router.get('/getTotalPriceWithScore', auth.authentification, (req, res) => {
    const getTotalPriceWithScore = "SELECT booking.idBooking, clients.name, booking.totalPrice, mgResults.score, miniGames.reward FROM booking INNER JOIN clients ON clients.idClient = booking.idClient INNER JOIN mgResults ON mgResults.idClient = clients.idClient INNER JOIN miniGames ON miniGames.idMiniGame = mgResults.idMiniGame;";
    bdd.query( getTotalPriceWithScore, (error, result) => {
        if (error) throw result;
        res.json(result);
    });
});




module.exports = router;