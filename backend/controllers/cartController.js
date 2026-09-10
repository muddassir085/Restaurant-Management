const Cart = require("../models/Cart");
const MenuItem = require("../models/MenuItem");

// Get cart
const getCart = async (req, res) => {
  try {
    let cart = await Cart.findOne({
      user: req.user.userId,
    }).populate("items.menuItem");

    if (!cart) {
      cart = await Cart.create({
        user: req.user.userId,
        items: [],
      });
    }

    res.status(200).json({
      success: true,
      cart,
    });
  } catch (error) {
    console.log("Get Cart Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to get cart",
    });
  }
};

// Add item to cart
const addToCart = async (req, res) => {
  try {
    const { menuItemId, quantity = 1 } = req.body;

    if (!menuItemId) {
      return res.status(400).json({
        success: false,
        message: "Menu item is required",
      });
    }

    const menuItem = await MenuItem.findById(menuItemId);

    if (!menuItem) {
      return res.status(404).json({
        success: false,
        message: "Menu item not found",
      });
    }

    if (!menuItem.availability) {
      return res.status(400).json({
        success: false,
        message: "This item is currently unavailable",
      });
    }

    let cart = await Cart.findOne({
      user: req.user.userId,
    });

    if (!cart) {
      cart = await Cart.create({
        user: req.user.userId,
        items: [
          {
            menuItem: menuItemId,
            quantity,
          },
        ],
      });
    } else {
      const existingItem = cart.items.find(
        (item) =>
          item.menuItem.toString() === menuItemId
      );

      if (existingItem) {
        existingItem.quantity += Number(quantity);
      } else {
        cart.items.push({
          menuItem: menuItemId,
          quantity,
        });
      }

      await cart.save();
    }

    await cart.populate("items.menuItem");

    res.status(200).json({
      success: true,
      message: "Item added to cart",
      cart,
    });
  } catch (error) {
    console.log("Add To Cart Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to add item to cart",
    });
  }
};

// Update quantity
const updateCartItem = async (req, res) => {
  try {
    const { menuItemId } = req.params;
    const { quantity } = req.body;

    if (!quantity || quantity < 1) {
      return res.status(400).json({
        success: false,
        message: "Quantity must be at least 1",
      });
    }

    const cart = await Cart.findOne({
      user: req.user.userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    const item = cart.items.find(
      (cartItem) =>
        cartItem.menuItem.toString() === menuItemId
    );

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Item not found in cart",
      });
    }

    item.quantity = quantity;

    await cart.save();
    await cart.populate("items.menuItem");

    res.status(200).json({
      success: true,
      message: "Cart updated",
      cart,
    });
  } catch (error) {
    console.log("Update Cart Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to update cart",
    });
  }
};

// Remove item
const removeFromCart = async (req, res) => {
  try {
    const { menuItemId } = req.params;

    const cart = await Cart.findOne({
      user: req.user.userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = cart.items.filter(
      (item) =>
        item.menuItem.toString() !== menuItemId
    );

    await cart.save();
    await cart.populate("items.menuItem");

    res.status(200).json({
      success: true,
      message: "Item removed from cart",
      cart,
    });
  } catch (error) {
    console.log("Remove Cart Item Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to remove item",
    });
  }
};

// Clear cart
const clearCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user.userId,
    });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found",
      });
    }

    cart.items = [];

    await cart.save();

    res.status(200).json({
      success: true,
      message: "Cart cleared",
      cart,
    });
  } catch (error) {
    console.log("Clear Cart Error:", error);

    res.status(500).json({
      success: false,
      message: "Failed to clear cart",
    });
  }
};

module.exports = {
  getCart,
  addToCart,
  updateCartItem,
  removeFromCart,
  clearCart,
};