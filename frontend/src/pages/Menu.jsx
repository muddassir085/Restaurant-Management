import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import PublicNavbar from "../components/PublicNavbar";
import { getMenuItems } from "../services/menuService";
import { addToCart } from "../services/cartService";

function Menu() {
  const navigate = useNavigate();

  const [menuItems, setMenuItems] = useState([]);
  const [selectedCategory, setSelectedCategory] =
    useState("All");

  const [quantities, setQuantities] = useState({});
  const [addingId, setAddingId] = useState(null);
  const [successId, setSuccessId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const categories = [
    "All",
    "Starter",
    "Main Course",
    "Dessert",
    "Beverage",
  ];

  useEffect(() => {
    let ignore = false;

    const loadMenu = async () => {
      try {
        const data = await getMenuItems();

        if (!ignore) {
          setMenuItems(data.menuItems);
          setError("");
        }
      } catch (error) {
        console.log("Menu Error:", error);

        if (!ignore) {
          setError(
            error.response?.data?.message ||
              "Failed to load menu"
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadMenu();

    return () => {
      ignore = true;
    };
  }, []);

  const getQuantity = (id) => {
    return quantities[id] || 1;
  };

  const increaseQuantity = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: getQuantity(id) + 1,
    }));
  };

  const decreaseQuantity = (id) => {
    setQuantities((prev) => ({
      ...prev,
      [id]: Math.max(1, getQuantity(id) - 1),
    }));
  };

  const handleAddToCart = async (item) => {
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
      setSuccessId(null);
      setAddingId(item._id);

      const quantity = getQuantity(item._id);

      await addToCart(item._id, quantity);

      setSuccessId(item._id);

      setTimeout(() => {
        setSuccessId(null);
      }, 2000);
    } catch (error) {
      console.log("Add To Cart Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to add item to cart"
      );
    } finally {
      setAddingId(null);
    }
  };

  const filteredItems =
    selectedCategory === "All"
      ? menuItems
      : menuItems.filter(
          (item) => item.category === selectedCategory
        );

  return (
    <div className="min-h-screen bg-gray-50">
      <PublicNavbar />

      {/* Header */}
      <section className="bg-white border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 py-12 text-center">

          <p className="text-teal-600 font-semibold">
            OUR MENU
          </p>

          <h1 className="text-4xl sm:text-5xl font-bold text-gray-900 mt-2">
            Something Delicious for Everyone
          </h1>

          <p className="text-gray-600 max-w-2xl mx-auto mt-4">
            Explore our selection of freshly prepared dishes
            and choose your favourite.
          </p>

        </div>
      </section>

      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-10">

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-10">
          {categories.map((category) => (
            <button
              key={category}
              onClick={() =>
                setSelectedCategory(category)
              }
              className={`px-5 py-2.5 rounded-full font-medium transition ${
                selectedCategory === category
                  ? "bg-teal-600 text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:border-teal-500 hover:text-teal-600"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mb-8 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div className="text-center py-16">
            <p className="text-gray-500">
              Loading menu...
            </p>
          </div>
        )}

        {/* Empty */}
        {!loading &&
          !error &&
          filteredItems.length === 0 && (
            <div className="text-center py-16">

              <div className="text-5xl">
                🍽️
              </div>

              <h2 className="text-2xl font-bold text-gray-800 mt-4">
                No items found
              </h2>

              <p className="text-gray-500 mt-2">
                There are no items in this category right now.
              </p>

            </div>
          )}

        {/* Menu Grid */}
        {!loading &&
          filteredItems.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">

              {filteredItems.map((item) => {
                const quantity = getQuantity(item._id);
                const isAdding = addingId === item._id;
                const isSuccess = successId === item._id;

                return (
                  <div
                    key={item._id}
                    className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm hover:shadow-lg transition"
                  >

                    {/* Image */}
                    <div className="relative">

                      {item.image ? (
                        <img
                          src={item.image}
                          alt={item.name}
                          className="w-full h-56 object-cover"
                        />
                      ) : (
                        <div className="w-full h-56 bg-teal-50 flex items-center justify-center">
                          <span className="text-6xl">
                            🍽️
                          </span>
                        </div>
                      )}

                      {/* Availability */}
                      <span
                        className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
                          item.availability
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {item.availability
                          ? "Available"
                          : "Unavailable"}
                      </span>

                    </div>

                    {/* Content */}
                    <div className="p-5">

                      {/* Name + Price */}
                      <div className="flex items-start justify-between gap-4">

                        <div>
                          <p className="text-sm text-teal-600 font-medium">
                            {item.category}
                          </p>

                          <h2 className="text-xl font-bold text-gray-900 mt-1">
                            {item.name}
                          </h2>
                        </div>

                        <p className="text-xl font-bold text-teal-600 whitespace-nowrap">
                          ₹{item.price}
                        </p>

                      </div>

                      {/* Description */}
                      <p className="text-gray-600 text-sm mt-3 line-clamp-2">
                        {item.description}
                      </p>

                      {/* Quantity */}
                      {item.availability && (
                        <div className="flex items-center justify-between mt-5">

                          <span className="text-sm font-medium text-gray-700">
                            Quantity
                          </span>

                          <div className="flex items-center">

                            <button
                              onClick={() =>
                                decreaseQuantity(item._id)
                              }
                              disabled={isAdding}
                              className="w-9 h-9 border border-gray-300 rounded-l-lg hover:bg-gray-100 disabled:opacity-40"
                            >
                              −
                            </button>

                            <div className="w-11 h-9 border-y border-gray-300 flex items-center justify-center font-semibold">
                              {quantity}
                            </div>

                            <button
                              onClick={() =>
                                increaseQuantity(item._id)
                              }
                              disabled={isAdding}
                              className="w-9 h-9 border border-gray-300 rounded-r-lg hover:bg-gray-100 disabled:opacity-40"
                            >
                              +
                            </button>

                          </div>

                        </div>
                      )}

                      {/* Actions */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">

                        <button
                          onClick={() =>
                            handleAddToCart(item)
                          }
                          disabled={
                            !item.availability || isAdding
                          }
                          className="bg-teal-600 text-white py-2.5 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          {isAdding
                            ? "Adding..."
                            : isSuccess
                            ? "✓ Added"
                            : "🛒 Add to Cart"}
                        </button>

                        <Link
                          to={`/menu/${item._id}`}
                          className="border border-teal-600 text-teal-600 py-2.5 rounded-lg font-semibold text-center hover:bg-teal-50 transition"
                        >
                          View Details
                        </Link>

                      </div>

                    </div>
                  </div>
                );
              })}

            </div>
          )}

      </main>
    </div>
  );
}

export default Menu;