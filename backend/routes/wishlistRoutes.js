const express = require('express');
const router = express.Router();
const { getWishlist, addWishlist, removeWishlist } = require('../controllers/wishlistController');
const { protect } = require('../middleware/authMiddleware');

router.route('/')
  .get(protect, getWishlist)
  .post(protect, addWishlist)
  .delete(protect, removeWishlist);

module.exports = router;