var express = require('express');
var router = express.Router();

var cacheController = require("../controllers/cacheController");

/* GET routes. */
router.get('/data', cacheController.getAll);
router.get('/data/:key', cacheController.getData);

/* POST Routes. */
router.post('/data/:key', cacheController.setData);

/* DELETE ROUTES. */
router.delete('/data', cacheController.deleteAll);
router.delete('/data/:key', cacheController.deleteData);


module.exports = router;