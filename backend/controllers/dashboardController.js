const MenuItem = require("../models/MenuItem");
const User = require("../models/User");
const DashboardStats = require("../models/DashboardStats");

const getDashboardStats = async (req, res) => {
  try {
    const totalMenuItems = await MenuItem.countDocuments();

    const totalGuests = await User.countDocuments({
      role: "guest",
    });

    let stats = await DashboardStats.findOne();

    // Agar stats document nahi hai to create kar do
    if (!stats) {
      stats = await DashboardStats.create({
        totalOrders: 0,
      });
    }

    res.status(200).json({
      success: true,
      stats: {
        totalMenuItems,
        totalGuests,
        totalOrders: stats.totalOrders,
      },
    });
  } catch (error) {
    console.log("Dashboard Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const updateOrderCount = async (req, res) => {
  try {
    const { totalOrders } = req.body;

    if (totalOrders === undefined || totalOrders < 0) {
      return res.status(400).json({
        success: false,
        message: "Valid order count is required",
      });
    }

    let stats = await DashboardStats.findOne();

    if (!stats) {
      stats = await DashboardStats.create({
        totalOrders,
      });
    } else {
      stats.totalOrders = totalOrders;
      await stats.save();
    }

    res.status(200).json({
      success: true,
      message: "Order count updated successfully",
      totalOrders: stats.totalOrders,
    });
  } catch (error) {
    console.log("Update Order Count Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  getDashboardStats,
  updateOrderCount,
};