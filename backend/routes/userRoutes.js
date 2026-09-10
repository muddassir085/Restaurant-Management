const express = require("express");

const router = express.Router();

const { 
    getAllUsers,
    deleteUser,
 } = require("../controllers/userController");

const authMiddleware = require("../middleware/authMiddleware");
const adminMiddleware = require("../middleware/adminMiddleware");

router.get(
  "/",
  authMiddleware,
  adminMiddleware,
  getAllUsers
);

router.delete(
  "/:id",
  authMiddleware,
  adminMiddleware,
  deleteUser
);

module.exports = router;