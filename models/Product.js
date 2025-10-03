const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    stock: {
      type: Number,
      required: true,
    },
    images: {
      type: Array,
      required: true,
    },
    rating: {
      type: Number,
      default: 5,
    },
    originalPrice: { type: Number }, // MRP ya cross price
    discount: { type: Number }, // % off
    ratingCount: { type: Number, default: 0 }, // kitne users ne rate kiya
    rating: { type: Number, default: 4 }, // average rating

    review: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review",
      },
    ],
    colors: {
      type: Array,
      required: true,
    },

    // ✅ Sizes field added
    sizes: [
      {
        label: { type: String, required: true }, // e.g. "M", "XL", "Free Size"
        available: { type: Boolean, default: false }, // true = show to users
      },
    ],

    blacklisted: {
      type: Boolean,
      default: false,
    },
    category: {
      type: String,
      enum: [
        "Lehenga",
        "Saree",
        "Kurti",
        "Girl Top",
        "Girl T-shirt",
        "Gown",
        "BottomWear",
        "Boy Shirt",
        "Boy T-shirt",
        "Kurta",
        "Jeans",
      ],
      required: true,
    },
  },

  { timestamps: true }
);

productSchema.method.calculateRating = async function () {
  const reviews = await Review.find({ productId: this._id });
  if (reviews.length > 0) {
    const totalRating = reviews.reduce((acc, review) => acc + review.rating, 0);
    this.rating = totalRating / reviews.length;
  } else {
    this.rating = 5;
  }
  await this.save();
};

const Product = mongoose.model("Product", productSchema);

module.exports = Product;
