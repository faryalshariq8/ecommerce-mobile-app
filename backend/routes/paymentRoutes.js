const express = require('express');
const router = express.Router();
const { createPaymentIntent, confirmOrderPaid } = require('../controllers/paymentController');
const { protect } = require('../middleware/authMiddleware');

router.post('/create-intent', protect, createPaymentIntent);
router.put('/:id/confirm', protect, confirmOrderPaid);

module.exports = router;
