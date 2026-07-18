const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    brand: {
      type: String,
      default: "PosterHaus Studio",
    },

    price: {
      type: Number,
      required: true,
    },

    countInStock: {
      type: Number,
      default: 10,
    },

    rating: {
      type: Number,
      default: 4.8,
    },

    numReviews: {
      type: Number,
      default: 100,
    },
  },

  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Product", productSchema);