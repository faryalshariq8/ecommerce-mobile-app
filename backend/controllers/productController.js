const Product = require('../models/Product');

// GET /api/products
exports.getProducts = async (req, res) => {
  const query = {};
  if (req.query.keyword) {
    query.name = { $regex: req.query.keyword, $options: 'i' };
  }
  if (req.query.category) {
    query.category = req.query.category;
  }
  const products = await Product.find(query).populate('category', 'name');
  res.json(products);
};

// GET /api/products/:id
exports.getProductById = async (req, res) => {
  const product = await Product.findById(req.params.id).populate('category', 'name');
  if (!product) return res.status(404).json({ message: 'Product not found' });
  res.json(product);
};

// POST /api/products  (admin)
exports.createProduct = async (req, res) => {
  try {
    const { name, price, image, brand, category, countInStock, description } = req.body;
    const product = await Product.create({
      user: req.user._id,
      name, price, image: image || 'no-photo.jpg',
      brand, category, countInStock, description,
    });
    res.status(201).json(product);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// PUT /api/products/:id  (admin)
exports.updateProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  Object.assign(product, req.body);
  const updated = await product.save();
  res.json(updated);
};

// DELETE /api/products/:id  (admin)
exports.deleteProduct = async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) return res.status(404).json({ message: 'Product not found' });
  await product.deleteOne();
  res.json({ message: 'Product removed' });
};
