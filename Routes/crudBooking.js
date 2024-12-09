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

// Afficher les réservations en fonction du rôle
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







module.exports = router;