import { useEffect, useRef, useState } from "react";

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

  // Reference for automatic scrolling to the edit form
  const editFormRef = useRef(null);

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

  // Automatically scroll when an item is selected for editing
  useEffect(() => {
    if (editingItem && editFormRef.current) {
      editFormRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [editingItem]);

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

      if (editingItem?._id === id) {
        setEditingItem(null);
      }
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

  const getDietaryLabel = (dietaryType) => {
    switch (dietaryType?.toLowerCase()) {
      case "veg":
        return "Vegetarian";
      case "non-veg":
        return "Non-Vegetarian";
      case "vegan":
        return "Vegan";
      default:
        return "Not specified";
    }
  };

  const getSpiceLabel = (spiceLevel) => {
    switch (spiceLevel?.toLowerCase()) {
      case "mild":
        return "Mild";
      case "medium":
        return "Medium";
      case "hot":
        return "Hot";
      case "sweet":
        return "Sweet";  
      default:
        return "Not specified";
    }
  };

  const getSpiceIcon = (spiceLevel) => {
    switch (spiceLevel?.toLowerCase()) {
      case "mild":
        return "🌶️";
      case "medium":
        return "🌶️🌶️";
      case "hot":
        return "🌶️🌶️🌶️";
      case "sweet":
        return "🍯";  
      default:
        return "🌶️";
    }
  };

  return (
    <div className="app-shell min-h-screen">
      <AdminNavbar />

      <main className="mx-auto max-w-7xl px-5 py-8 sm:px-8 md:py-12">

        {/* Header */}
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="font-semibold text-teal-600">
              <span className="eyebrow">Admin Panel</span>
            </p>

            <h1 className="mt-1 text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
              Manage Menu
            </h1>

            <p className="mt-2 text-gray-500">
              Add, edit and manage your restaurant menu.
            </p>
          </div>

          <button
            type="button"
            onClick={() => {
              setEditingItem(null);
              setShowAddForm(true);
            }}
            className="btn-primary px-5 py-3"
          >
            + Add Menu Item
          </button>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 rounded-lg border border-red-100 bg-red-50 px-4 py-3 text-red-600">
            {error}
          </div>
        )}

        {/* Add Form */}
        {showAddForm && (
          <div className="mt-8 scroll-mt-6">
            <AddMenuForm
              onItemAdded={handleItemAdded}
              onCancel={() => setShowAddForm(false)}
            />
          </div>
        )}

        {/* Edit Form - Auto Scroll Target */}
        {editingItem && (
          <div
            ref={editFormRef}
            className="mt-8 scroll-mt-6"
          >
            <EditMenuForm
              item={editingItem}
              onItemUpdated={handleItemUpdated}
              onCancel={() => setEditingItem(null)}
            />
          </div>
        )}

        {/* Menu Listing */}
        {loading ? (
          <div className="py-20 text-center">
            <p className="text-gray-500">
              Loading menu...
            </p>
          </div>
        ) : menuItems.length === 0 ? (
          <div className="glass-panel mt-8 rounded-3xl py-16 text-center">
            <div className="text-6xl">🍽️</div>

            <h2 className="mt-4 text-2xl font-bold text-gray-900">
              No menu items yet
            </h2>

            <p className="mt-2 text-gray-500">
              Start by adding your first menu item.
            </p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">

            {menuItems.map((item) => {
              const dietaryType =
                item.dietaryType || "unknown";

              const spiceLevel =
                item.spiceLevel || "unknown";

              return (
                <div
                  key={item._id}
                  className="glass-card page-enter overflow-hidden rounded-3xl"
                >
                  {/* Image */}
                  <div className="relative">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="h-52 w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-52 w-full items-center justify-center bg-teal-50">
                        <span className="text-6xl">🍽️</span>
                      </div>
                    )}

                    <span
                      className={`absolute right-4 top-4 rounded-full px-3 py-1 text-xs font-semibold ${
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
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-teal-600">
                          {item.category}
                        </p>

                        <h2 className="mt-1 break-words text-xl font-bold text-gray-900">
                          {item.name}
                        </h2>
                      </div>

                      <p className="whitespace-nowrap text-lg font-black text-teal-700">
                        ₹{item.price}
                      </p>
                    </div>

                    <p className="mt-3 line-clamp-2 text-sm text-gray-500">
                      {item.description}
                    </p>

                    {/* Dietary Type and Spice Level */}
                    <div className="mt-4 flex flex-wrap gap-2">
                      <span
                        className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                          dietaryType === "veg"
                            ? "bg-green-100 text-green-800"
                            : dietaryType === "non-veg"
                            ? "bg-red-100 text-red-800"
                            : dietaryType === "vegan"
                            ? "bg-emerald-100 text-emerald-800"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {dietaryType === "veg"
                          ? "🟢 "
                          : dietaryType === "non-veg"
                          ? "🔴 "
                          : dietaryType === "vegan"
                          ? "🌱 "
                          : ""}
                        {getDietaryLabel(dietaryType)}
                      </span>

                      <span className="rounded-full bg-orange-50 px-3 py-1.5 text-xs font-semibold text-orange-800">
                        {getSpiceIcon(spiceLevel)}{" "}
                        {getSpiceLabel(spiceLevel)}
                      </span>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 grid grid-cols-2 gap-3">
                      <button
                        type="button"
                        onClick={() => {
                          setShowAddForm(false);
                          setEditingItem(item);
                        }}
                        className="rounded-lg border border-teal-600 py-2 font-medium text-teal-600 transition hover:bg-teal-50"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => handleDelete(item._id)}
                        className="rounded-lg border border-red-200 py-2 font-medium text-red-600 transition hover:bg-red-50"
                      >
                        Delete
                      </button>
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

export default AdminMenu;
