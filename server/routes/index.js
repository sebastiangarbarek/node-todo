const express = require('express');

var authenticate = require('../middleware/authenticate');
var indexController = require('../controllers/index-controller');

var router = express.Router();

router.get('/', authenticate, indexController.getHome);
router.post('/join', indexController.postJoin);
router.post('/login', indexController.postLogin);
router.delete('/logout', authenticate, indexController.deleteLogout);

module.exports = router;
