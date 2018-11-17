const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');
const OrdersController = require('../controllers/orders');

router.get('/', OrdersController.order_get_all);

router.post('/', checkAuth, OrdersController.add_order);

router.get('/:orderId', checkAuth, OrdersController.get_order);

router.delete('/:orderId', checkAuth, OrdersController.delete_order);

module.exports = router;
