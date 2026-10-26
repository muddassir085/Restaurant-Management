const MenuItem = require("../models/MenuItem");
const cloudinary = require("../config/cloudinary");

const createMenuItem = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      availability,
      dietaryType,
      spiceLevel,
    } = req.body;

    if (!name || !description || !category || price === undefined) {
      return res.status(400).json({
        success: false,
        message: "Required fields are missing",
      });
    }

    let imageUrl = "";

    // Upload image to Cloudinary
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "tastybites/menu",
              resource_type: "image",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          )
          .end(req.file.buffer);
      });

      imageUrl = result.secure_url;
    }

    const menuItem = await MenuItem.create({
      name,
      description,
      category,
      price,
      availability,
      image: imageUrl,
      dietaryType: dietaryType || "unknown",
      spiceLevel: spiceLevel || "unknown",
    });

    res.status(201).json({
      success: true,
      message: "Menu item created successfully",
      menuItem,
    });
  } catch (error) {
    console.log("Create Menu Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getAllMenuItems = async (req, res) => {
  try {
    const menuItems = await MenuItem.find().sort({
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: menuItems.length,
      menuItems,
    });
  } catch (error) {
    console.log("Get Menu Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const getMenuItemById = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    res.status(200).json({
      success: true,
      menuItem,
    });
  } catch (error) {
    console.log("Get Menu Item Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const updateMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    const {
      name,
      description,
      category,
      price,
      availability,
      dietaryType,
      spiceLevel,
    } = req.body;

    // Update text/data fields
    menuItem.name = name ?? menuItem.name;
    menuItem.description = description ?? menuItem.description;
    menuItem.category = category ?? menuItem.category;
    menuItem.price = price ?? menuItem.price;
    menuItem.availability =
      availability !== undefined
        ? availability
        : menuItem.availability;

    menuItem.dietaryType =
      dietaryType ?? menuItem.dietaryType ?? "unknown";

    menuItem.spiceLevel =
      spiceLevel ?? menuItem.spiceLevel ?? "unknown";

    // Upload new image if provided
    if (req.file) {
      const result = await new Promise((resolve, reject) => {
        cloudinary.uploader
          .upload_stream(
            {
              folder: "tastybites/menu",
              resource_type: "image",
            },
            (error, result) => {
              if (error) {
                reject(error);
              } else {
                resolve(result);
              }
            }
          )
          .end(req.file.buffer);
      });

      menuItem.image = result.secure_url;
    }

    await menuItem.save();

    res.status(200).json({
      success: true,
      message: "Menu item updated successfully",
      menuItem,
    });
  } catch (error) {
    console.log("Update Menu Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const deleteMenuItem = async (req, res) => {
  try {
    const menuItem = await MenuItem.findById(req.params.id);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    await MenuItem.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Menu item deleted successfully",
    });
  } catch (error) {
    console.log("Delete Menu Error:", error);

    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

module.exports = {
  createMenuItem,
  getAllMenuItems,
  getMenuItemById,
  updateMenuItem,
  deleteMenuItem,
};