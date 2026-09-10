const express = require("express");
const router = express.Router();

const {
  getDashboardStats,
  updateOrderCount,
} = require("../controllers/dashboardController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

// Get dashboard stats
router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getDashboardStats
);

// Manually update order count
router.put(
  "/orders",
  authMiddleware,
  adminMiddleware,
  updateOrderCount
);

module.exports = router;