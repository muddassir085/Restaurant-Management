const express = require("express");
const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

const { getAllUsers } = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

const {
  createMenuItem,
  getAllMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
} = require("../controllers/menuController");

// public
router.get("/", getAllMenuItems);
router.get("/:id", getMenuItemById);

// admin only
router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  createMenuItem,
);

router.put(
  "/:id",
  authMiddleware,
  adminMiddleware,
  upload.single("image"),
  updateMenuItem
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteMenuItem
);

module.exports = router;