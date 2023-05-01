const express = require('express');
const router = express.Router()
const MainController = require('../app/controllers/MainController.js');

router.get('/', MainController.renderHome)
router.get('/services', MainController.renderServices)
router.get('/get-data', MainController.getData)
router.post('/booking', MainController.booking)
router.get('/orders', MainController.renderOrders)
router.get('/get-orders', MainController.getAllOrders)
router.get('/analytics', MainController.renderAnalytics)
router.post('/delete-order', MainController.deleteOrder)
module.exports = router;
