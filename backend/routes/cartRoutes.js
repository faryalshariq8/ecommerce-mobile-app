const express = require("express");
const router = express.Router();

const { protect } = require("../middleware/authMiddleware");

const {
  getCart,
  addToCart,
  updateQuantity,
  removeItem,
} = require("../controllers/cartController");

router.get("/", protect, getCart);

router.post("/add", protect, addToCart);

router.put("/update", protect, updateQuantity);

router.delete("/remove", protect, removeItem);

module.exports = router;