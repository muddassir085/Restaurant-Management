const express = require("express");

const router = express.Router();

const {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} = require("../controllers/cartController");

const authMiddleware = require("../middleware/authMiddleware");

// Get cart
router.get("/", authMiddleware, getCart);

// Add item
router.post("/", authMiddleware, addToCart);

// Update quantity
router.put(
  "/:menuItemId",
  authMiddleware,
  updateCartItem
);

// Remove item
router.delete(
  "/:menuItemId",
  authMiddleware,
  removeFromCart
);

// Clear cart
router.delete(
  "/",
  authMiddleware,
  clearCart
);

module.exports = router;