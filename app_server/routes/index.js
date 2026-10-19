const tripsController = require('../../app_api/controllers/trips');

var express = require('express');
var router = express.Router();
const ctrlMain = require('../controllers/main');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});
router.route("/trips").get(tripsController.tripsList).post(tripsController.tripsAddTrip);
router.route('/trips/:tripCode').get(tripsController.tripsFindByCode);

module.exports = router;
