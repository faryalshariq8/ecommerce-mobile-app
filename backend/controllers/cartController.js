const Cart = require("../models/Cart");
const Product = require("../models/Product");

exports.getCart = async (req, res) => {
  let cart = await Cart.findOne({ user: req.user._id }).populate("items.product");

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [],
    });
  }

  res.json(cart);
};

//Add to Cart
exports.addToCart = async (req, res) => {
  const { productId, quantity } = req.body;

  const product = await Product.findById(productId);

  if (!product) {
    return res.status(404).json({
      message: "Product not found",
    });
  }

  let cart = await Cart.findOne({ user: req.user._id });

  if (!cart) {
    cart = await Cart.create({
      user: req.user._id,
      items: [],
    });
  }

  console.log("Incoming:", productId);
    cart.items.forEach((item) => {
    console.log("Existing:", item.product.toString());
    });
    
  const existingItem = cart.items.find(
    item => item.product.equals(productId)
    );

    console.log("Found existing?", !!existingItem);

  if (existingItem) {
    existingItem.quantity += Number(quantity);
  } else {
    cart.items.push({
      product: productId,
      quantity,
    });
  }

  await cart.save();

  const updatedCart = await Cart.findById(cart._id).populate("items.product");

  res.json(updatedCart);
};

//Update Quantity
exports.updateQuantity = async (req, res) => {
  const { productId, quantity } = req.body;

  const cart = await Cart.findOne({ user: req.user._id });

  if (!cart)
    return res.status(404).json({
      message: "Cart not found",
    });

  const item = cart.items.find(
    item => item.product.toString() === productId
  );

  if (!item)
    return res.status(404).json({
      message: "Item not found",
    });

  item.quantity = quantity;

  await cart.save();

  const updated = await Cart.findById(cart._id).populate("items.product");

  res.json(updated);
};

//Remove Item
exports.removeItem = async (req, res) => {
  const { productId } = req.body;

  const cart = await Cart.findOne({
    user: req.user._id,
  });

  cart.items = cart.items.filter(
    item => item.product.toString() !== productId
  );

  await cart.save();

  const updated = await Cart.findById(cart._id).populate("items.product");

  res.json(updated);
};