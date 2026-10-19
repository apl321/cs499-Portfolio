const express = require("express");
const router = express.Router();
const authenticateJWT = require("../middleware/auth");

const tripsController = require("../controllers/trips");
const authController = require("../controllers/authentication");


router.post("/register", authController.register);
router.post("/login", authController.login);


router.route("/trips")
    .get(tripsController.tripsList) 
    .post(authenticateJWT, tripsController.tripsAddTrip);

router.route("/trips/:tripCode")
    .get(tripsController.tripsFindByCode)
    .put(authenticateJWT,tripsController.tripsUpdateTrip);



module.exports = router;
