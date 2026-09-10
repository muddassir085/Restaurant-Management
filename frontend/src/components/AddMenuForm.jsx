import { useState } from "react";
import { createMenuItem } from "../services/menuService";

function AddMenuForm({ onItemAdded, onCancel }) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("Main Course");
  const [price, setPrice] = useState("");
  const [availability, setAvailability] = useState(true);
  const [image, setImage] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("description", description);
      formData.append("category", category);
      formData.append("price", price);
      formData.append("availability", availability);

      if (image) {
        formData.append("image", image);
      }

      const data = await createMenuItem(formData);

      onItemAdded(data.menuItem);
    } catch (error) {
      console.log("Add Menu Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to add menu item"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 sm:p-8">

      <div className="flex items-center justify-between gap-4 mb-7">

        <div>
          <p className="text-teal-600 font-semibold text-sm">
            NEW ITEM
          </p>

          <h2 className="text-2xl font-bold text-gray-900 mt-1">
            Add Menu Item
          </h2>
        </div>

        <button
          onClick={onCancel}
          className="text-gray-400 hover:text-gray-700 text-xl"
        >
          ✕
        </button>

      </div>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 gap-5"
      >

        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Name
          </label>

          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Chicken Biryani"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Category
          </label>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          >
            <option value="Starter">Starter</option>
            <option value="Main Course">Main Course</option>
            <option value="Dessert">Dessert</option>
            <option value="Beverage">Beverage</option>
          </select>
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Price
          </label>

          <input
            type="number"
            min="0"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="299"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={(e) =>
              setImage(e.target.files[0] || null)
            }
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
          />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>

          <textarea
            rows="4"
            value={description}
            onChange={(e) =>
              setDescription(e.target.value)
            }
            placeholder="Describe the dish..."
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none resize-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </div>

        {/* Availability */}
        <div className="md:col-span-2">

          <label className="flex items-center gap-3 cursor-pointer">

            <input
              type="checkbox"
              checked={availability}
              onChange={(e) =>
                setAvailability(e.target.checked)
              }
              className="w-4 h-4 accent-teal-600"
            />

            <span className="text-sm font-medium text-gray-700">
              Item is available
            </span>

          </label>

        </div>

        {/* Error */}
        {error && (
          <div className="md:col-span-2 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Buttons */}
        <div className="md:col-span-2 flex flex-col sm:flex-row gap-3 pt-2">

          <button
            type="submit"
            disabled={loading}
            className="bg-teal-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-teal-700 transition disabled:opacity-50"
          >
            {loading ? "Adding..." : "Add Menu Item"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50"
          >
            Cancel
          </button>

        </div>

      </form>
    </div>
  );
}

export default AddMenuForm;