const mongoose = require("mongoose");

const dashboardStatsSchema = new mongoose.Schema(
  {
    totalOrders: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

const DashboardStats = mongoose.model(
  "DashboardStats",
  dashboardStatsSchema
);

module.exports = DashboardStats;