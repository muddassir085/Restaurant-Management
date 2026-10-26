const mongoose = require("mongoose");

const menuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      enum: ["Starter", "Main Course", "Dessert", "Beverage"],
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    availability: {
      type: Boolean,
      default: true,
    },

    image: {
      type: String,
      default: "",
    },

    dietaryType: {
      type: String,
      enum: ["veg", "non-veg", "vegan", "unknown"],
      default: "unknown",
    },

    spiceLevel: {
      type: String,
      enum: ["mild", "medium", "hot","sweet", "unknown"],
      default: "unknown",
    },
  },
  {
    timestamps: true,
  }
);

const MenuItem = mongoose.model("MenuItem", menuItemSchema);

module.exports = MenuItem;