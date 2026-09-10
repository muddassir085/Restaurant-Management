import { useEffect, useState } from "react";

import AdminNavbar from "../components/AdminNavbar";
import AddMenuForm from "../components/AddMenuForm";
import EditMenuForm from "../components/EditMenuForm";
import {
  getMenuItems,
  deleteMenuItem,
} from "../services/menuService";

function AdminMenu() {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingItem, setEditingItem] = useState(null);

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
        console.log("Admin Menu Error:", error);

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

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this menu item?"
    );

    if (!confirmed) return;

    try {
      await deleteMenuItem(id);

      setMenuItems((prevItems) =>
        prevItems.filter((item) => item._id !== id)
      );
    } catch (error) {
      console.log("Delete Menu Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete menu item"
      );
    }
  };

  const handleItemAdded = (newItem) => {
    setMenuItems((prevItems) => [
      newItem,
      ...prevItems,
    ]);

    setShowAddForm(false);
  };

  const handleItemUpdated = (updatedItem) => {
    setMenuItems((prevItems) =>
      prevItems.map((item) =>
        item._id === updatedItem._id
          ? updatedItem
          : item
      )
    );

    setEditingItem(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-8 md:py-12">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

          <div>
            <p className="text-teal-600 font-semibold">
              ADMIN PANEL
            </p>

            <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-1">
              Manage Menu
            </h1>

            <p className="text-gray-500 mt-2">
              Add, edit and manage your restaurant menu.
            </p>
          </div>

          <button
            onClick={() => {
              setShowAddForm(true);
              setEditingItem(null);
            }}
            className="bg-teal-600 text-white px-5 py-3 rounded-lg font-semibold hover:bg-teal-700 transition"
          >
            + Add Menu Item
          </button>

        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Add Form */}
        {showAddForm && (
          <div className="mt-8">
            <AddMenuForm
              onItemAdded={handleItemAdded}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        {/* Edit Form */}
        {editingItem && (
          <div className="mt-8">
            <EditMenuForm
              item={editingItem}
              onItemUpdated={handleItemUpdated}
              onCancel={() => setEditingItem(null)}
            />
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-500">
              Loading menu...
            </p>
          </div>
        ) : menuItems.length === 0 ? (
          /* Empty */
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm mt-8 py-16 text-center">

            <div className="text-6xl">
              🍽️
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-4">
              No menu items yet
            </h2>

            <p className="text-gray-500 mt-2">
              Start by adding your first menu item.
            </p>

          </div>
        ) : (
          /* Menu Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

            {menuItems.map((item) => (
              <div
                key={item._id}
                className="bg-white border border-gray-100 rounded-2xl shadow-sm overflow-hidden hover:shadow-md transition"
              >

                {/* Image */}
                <div className="relative">

                  {item.image ? (
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-52 object-cover"
                    />
                  ) : (
                    <div className="w-full h-52 bg-teal-50 flex items-center justify-center">
                      <span className="text-6xl">
                        🍽️
                      </span>
                    </div>
                  )}

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

                  <div className="flex justify-between items-start gap-3">

                    <div>
                      <p className="text-sm text-teal-600 font-medium">
                        {item.category}
                      </p>

                      <h2 className="text-xl font-bold text-gray-900 mt-1">
                        {item.name}
                      </h2>
                    </div>

                    <p className="text-lg font-bold text-teal-600 whitespace-nowrap">
                      ₹{item.price}
                    </p>

                  </div>

                  <p className="text-gray-500 text-sm mt-3 line-clamp-2">
                    {item.description}
                  </p>

                  {/* Actions */}
                  <div className="grid grid-cols-2 gap-3 mt-5">

                    <button
                      onClick={() => {
                        setEditingItem(item);
                        setShowAddForm(false);
                      }}
                      className="border border-teal-600 text-teal-600 py-2 rounded-lg font-medium hover:bg-teal-50 transition"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(item._id)}
                      className="border border-red-200 text-red-600 py-2 rounded-lg font-medium hover:bg-red-50 transition"
                    >
                      Delete
                    </button>

                  </div>

                </div>
              </div>
            ))}

          </div>
        )}

      </main>
    </div>
  );
}

export default AdminMenu;