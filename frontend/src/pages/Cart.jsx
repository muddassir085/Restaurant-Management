import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import PublicNavbar from "../components/PublicNavbar";
import {
  getCart,
  updateCartItem,
  removeFromCart,
  clearCart,
} from "../services/cartService";

function Cart() {
  const [cart, setCart] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadCart = async () => {
      try {
        const data = await getCart();

        if (!ignore) {
          setCart(data.cart);
          setError("");
        }
      } catch (error) {
        console.log("Cart Error:", error);

        if (!ignore) {
          setError(
            error.response?.data?.message ||
              "Failed to load cart"
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadCart();

    return () => {
      ignore = true;
    };
  }, []);

  const handleQuantityChange = async (
    menuItemId,
    quantity
  ) => {
    if (quantity < 1) return;

    try {
      setUpdatingId(menuItemId);
      setError("");

      const data = await updateCartItem(
        menuItemId,
        quantity
      );

      setCart(data.cart);
    } catch (error) {
      console.log("Quantity Update Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update quantity"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleRemove = async (menuItemId) => {
    try {
      setUpdatingId(menuItemId);
      setError("");

      const data = await removeFromCart(menuItemId);

      setCart(data.cart);
    } catch (error) {
      console.log("Remove Item Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to remove item"
      );
    } finally {
      setUpdatingId(null);
    }
  };

  const handleClearCart = async () => {
    const confirmed = window.confirm(
      "Are you sure you want to clear your cart?"
    );

    if (!confirmed) return;

    try {
      setLoading(true);
      setError("");

      const data = await clearCart();

      setCart(data.cart);
    } catch (error) {
      console.log("Clear Cart Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to clear cart"
      );
    } finally {
      setLoading(false);
    }
  };

  const totalItems =
    cart?.items?.reduce(
      (total, item) => total + item.quantity,
      0
    ) || 0;

  const totalPrice =
    cart?.items?.reduce(
      (total, item) =>
        total + item.menuItem.price * item.quantity,
      0
    ) || 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicNavbar />

        <div className="max-w-7xl mx-auto px-5 py-20 text-center">
          <p className="text-gray-500">
            Loading cart...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />

      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-8 md:py-12">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-teal-600 font-semibold">
              YOUR CART
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-1">
              Your Favourite Food
            </h1>

            <p className="text-gray-500 mt-2">
              {totalItems}{" "}
              {totalItems === 1 ? "item" : "items"} in your
              cart
            </p>
          </div>

          {cart?.items?.length > 0 && (
            <button
              onClick={handleClearCart}
              className="text-red-600 font-medium hover:text-red-700"
            >
              Clear Cart
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Empty Cart */}
        {!cart?.items?.length ? (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm mt-8 px-6 py-16 text-center">
            <div className="text-7xl">🛒</div>

            <h2 className="text-2xl font-bold text-gray-900 mt-5">
              Your cart is empty
            </h2>

            <p className="text-gray-500 mt-2">
              Looks like you haven't added anything yet.
            </p>

            <Link
              to="/menu"
              className="inline-block mt-7 bg-teal-600 text-white px-7 py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
            >
              Explore Menu
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">

            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {cart.items.map((item) => {
                const menuItem = item.menuItem;

                const itemTotal =
                  menuItem.price * item.quantity;

                const isUpdating =
                  updatingId === menuItem._id;

                return (
                  <div
                    key={menuItem._id}
                    className="bg-white border border-gray-100 rounded-2xl shadow-sm p-4 sm:p-5"
                  >
                    <div className="flex flex-col sm:flex-row gap-5">

                      {/* Image */}
                      <div className="w-full sm:w-32 h-48 sm:h-32 shrink-0 rounded-xl overflow-hidden bg-teal-50">
                        {menuItem.image ? (
                          <img
                            src={menuItem.image}
                            alt={menuItem.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-5xl">
                            🍽️
                          </div>
                        )}
                      </div>

                      {/* Details */}
                      <div className="flex-1">

                        <div className="flex justify-between gap-4">
                          <div>
                            <p className="text-sm text-teal-600 font-medium">
                              {menuItem.category}
                            </p>

                            <h2 className="text-xl font-bold text-gray-900 mt-1">
                              {menuItem.name}
                            </h2>
                          </div>

                          <button
                            onClick={() =>
                              handleRemove(menuItem._id)
                            }
                            disabled={isUpdating}
                            className="text-gray-400 hover:text-red-600 transition disabled:opacity-40"
                            title="Remove item"
                          >
                            ✕
                          </button>
                        </div>

                        <p className="text-gray-500 text-sm mt-2">
                          ₹{menuItem.price} per item
                        </p>

                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-5">

                          {/* Quantity */}
                          <div className="flex items-center">

                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  menuItem._id,
                                  item.quantity - 1
                                )
                              }
                              disabled={
                                item.quantity === 1 ||
                                isUpdating
                              }
                              className="w-9 h-9 border border-gray-300 rounded-l-lg hover:bg-gray-100 disabled:opacity-40"
                            >
                              −
                            </button>

                            <div className="w-12 h-9 border-y border-gray-300 flex items-center justify-center font-semibold">
                              {isUpdating
                                ? "..."
                                : item.quantity}
                            </div>

                            <button
                              onClick={() =>
                                handleQuantityChange(
                                  menuItem._id,
                                  item.quantity + 1
                                )
                              }
                              disabled={isUpdating}
                              className="w-9 h-9 border border-gray-300 rounded-r-lg hover:bg-gray-100 disabled:opacity-40"
                            >
                              +
                            </button>

                          </div>

                          {/* Item Total */}
                          <p className="text-xl font-bold text-teal-600">
                            ₹{itemTotal}
                          </p>

                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Order Summary */}
            <div>
              <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 lg:sticky lg:top-24">

                <h2 className="text-xl font-bold text-gray-900">
                  Order Summary
                </h2>

                <div className="border-t border-gray-100 my-5" />

                <div className="flex justify-between text-gray-600">
                  <span>Items</span>
                  <span>{totalItems}</span>
                </div>

                <div className="flex justify-between text-gray-600 mt-3">
                  <span>Subtotal</span>
                  <span>₹{totalPrice}</span>
                </div>

                <div className="flex justify-between text-gray-600 mt-3">
                  <span>Delivery</span>
                  <span className="text-green-600">
                    Free
                  </span>
                </div>

                <div className="border-t border-gray-100 my-5" />

                <div className="flex justify-between items-center">
                  <span className="text-lg font-semibold">
                    Total
                  </span>

                  <span className="text-2xl font-bold text-teal-600">
                    ₹{totalPrice}
                  </span>
                </div>

                <button
                  disabled
                  className="w-full mt-6 bg-teal-600 text-white py-3 rounded-lg font-semibold opacity-50 cursor-not-allowed"
                >
                  Proceed to Checkout
                </button>

                <p className="text-xs text-gray-400 text-center mt-3">
                  Checkout will be available soon.
                </p>

                <Link
                  to="/menu"
                  className="block text-center text-teal-600 font-medium mt-5 hover:underline"
                >
                  ← Continue Shopping
                </Link>

              </div>
            </div>

          </div>
        )}
      </main>
    </div>
  );
}

export default Cart;