import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";

import PublicNavbar from "../components/PublicNavbar";
import { addToCart } from "../services/cartService";

function MenuDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);

  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    const fetchMenuItem = async () => {
      try {
        const response = await axios.get(
          `${import.meta.env.VITE_API_URL}/menu-items/${id}`
        );

        setItem(response.data.menuItem);
      } catch (error) {
        console.log("Menu Details Error:", error);

        setError(
          error.response?.data?.message ||
            "Failed to load menu item"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchMenuItem();
  }, [id]);

  const increaseQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decreaseQuantity = () => {
    setQuantity((prev) => Math.max(1, prev - 1));
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(
      localStorage.getItem("user")
    );

    if (!token || !user) {
      navigate("/login");
      return;
    }

    if (user.role !== "guest") {
      setError("Only guests can add items to cart");
      return;
    }

    try {
      setError("");
      setSuccess("");
      setAdding(true);

      await addToCart(item._id, quantity);

      setSuccess(
        `${quantity} ${quantity === 1 ? "item" : "items"} added to cart 🛒`
      );
    } catch (error) {
      console.log("Add To Cart Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to add item to cart"
      );
    } finally {
      setAdding(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicNavbar />

        <div className="max-w-7xl mx-auto px-5 py-20 text-center">
          <p className="text-gray-500">
            Loading menu item...
          </p>
        </div>
      </div>
    );
  }

  if (error && !item) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PublicNavbar />

        <div className="max-w-7xl mx-auto px-5 py-20 text-center">
          <p className="text-red-600">
            {error}
          </p>

          <Link
            to="/menu"
            className="inline-block mt-5 text-teal-600 font-medium hover:underline"
          >
            ← Back to Menu
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />

      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-8 md:py-12">

        {/* Back */}
        <Link
          to="/menu"
          className="inline-flex items-center text-teal-600 font-medium hover:text-teal-700"
        >
          ← Back to Menu
        </Link>

        {/* Product Section */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden mt-6">

          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Image */}
            <div className="bg-teal-50">

              {item.image ? (
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-72 sm:h-96 lg:h-full min-h-105 object-cover"
                />
              ) : (
                <div className="w-full h-72 sm:h-96 lg:h-full min-h-105 flex items-center justify-center">
                  <span className="text-8xl">
                    🍽️
                  </span>
                </div>
              )}

            </div>

            {/* Details */}
            <div className="p-6 sm:p-8 lg:p-12 flex flex-col justify-center">

              {/* Category */}
              <p className="text-teal-600 font-semibold">
                {item.category}
              </p>

              {/* Name */}
              <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-2">
                {item.name}
              </h1>

              {/* Price */}
              <p className="text-3xl font-bold text-teal-600 mt-5">
                ₹{item.price}
              </p>

              {/* Description */}
              <p className="text-gray-600 leading-relaxed mt-6">
                {item.description}
              </p>

              {/* Availability */}
              <div className="mt-6">
                <span
                  className={`inline-flex items-center px-3 py-1.5 rounded-full text-sm font-semibold ${
                    item.availability
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  <span className="mr-2">
                    ●
                  </span>

                  {item.availability
                    ? "Available"
                    : "Currently Unavailable"}
                </span>
              </div>

              {/* Messages */}
              {error && (
                <p className="text-red-600 text-sm mt-5">
                  {error}
                </p>
              )}

              {success && (
                <p className="text-green-600 text-sm mt-5">
                  {success}
                </p>
              )}

              {/* Quantity */}
              {item.availability && (
                <div className="mt-7">

                  <p className="font-medium text-gray-800 mb-2">
                    Quantity
                  </p>

                  <div className="flex items-center">

                    <button
                      onClick={decreaseQuantity}
                      disabled={quantity === 1}
                      className="w-10 h-10 border border-gray-300 rounded-l-lg text-lg hover:bg-gray-100 disabled:opacity-40"
                    >
                      −
                    </button>

                    <div className="w-14 h-10 border-y border-gray-300 flex items-center justify-center font-semibold">
                      {quantity}
                    </div>

                    <button
                      onClick={increaseQuantity}
                      className="w-10 h-10 border border-gray-300 rounded-r-lg text-lg hover:bg-gray-100"
                    >
                      +
                    </button>

                  </div>

                </div>
              )}

              {/* Actions */}
              <div className="flex flex-col sm:flex-row gap-3 mt-7">

                <button
                  onClick={handleAddToCart}
                  disabled={!item.availability || adding}
                  className="flex-1 bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {adding
                    ? "Adding..."
                    : "🛒 Add to Cart"}
                </button>

                <Link
                  to="/cart"
                  className="flex-1 border border-teal-600 text-teal-600 px-6 py-3 rounded-lg font-semibold text-center hover:bg-teal-50 transition"
                >
                  View Cart
                </Link>

              </div>

            </div>
          </div>
        </div>

      </main>
    </div>
  );
}

export default MenuDetails;