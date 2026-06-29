const stripe = require('stripe')(process.env.STRIPE_SECRET);
const Order = require('../models/Order');

exports.createPaymentIntent = async (req, res) => {
  try {
    const { amount } = req.body; // in dollars
    const intent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100),
      currency: 'usd',
      automatic_payment_methods: { enabled: true },
    });
    res.json({ clientSecret: intent.client_secret });
  } catch (e) {
    res.status(500).json({ message: e.message });
  }
};

exports.confirmOrderPaid = async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) return res.status(404).json({ message: 'Order not found' });
  order.isPaid = true;
  order.paidAt = Date.now();
  order.paymentResult = {
    id: req.body.paymentIntentId,
    status: 'succeeded',
    update_time: new Date().toISOString(),
  };
  const updated = await order.save();
  res.json(updated);
};
