const express = require('express');
const router = express.Router()
const MainController = require('../app/controllers/MainController.js');

router.get('/home', MainController.renderHome)
router.get('/services', MainController.renderServices)
router.get('/get-services', MainController.getServices)
module.exports = router;
