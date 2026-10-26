
import { useState } from "react";
import { updateMenuItem } from "../services/menuService";

function EditMenuForm({
  item,
  onItemUpdated,
  onCancel,
}) {
  const [name, setName] = useState(item.name);
  const [description, setDescription] = useState(
    item.description
  );
  const [category, setCategory] = useState(item.category);
  const [price, setPrice] = useState(item.price);
  const [availability, setAvailability] = useState(
    item.availability
  );
  const [dietaryType, setDietaryType] = useState(
    item.dietaryType || "unknown"
  );
  const [spiceLevel, setSpiceLevel] = useState(
    item.spiceLevel || "unknown"
  );

  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(item.image || "");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleImageChange = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

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
      formData.append("dietaryType", dietaryType);
      formData.append("spiceLevel", spiceLevel);

      if (image) {
        formData.append("image", image);
      }

      const data = await updateMenuItem(
        item._id,
        formData
      );

      onItemUpdated(data.menuItem);
    } catch (error) {
      console.log("Edit Menu Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to update menu item"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="glass-panel page-enter rounded-3xl p-6 sm:p-8">

      <div className="flex items-center justify-between gap-4 mb-7">
        <div>
          <p className="eyebrow">
            EDIT ITEM
          </p>

          <h2 className="text-2xl font-black tracking-tight text-slate-900 mt-1">
            Update Menu Item
          </h2>
        </div>

        <button
          onClick={onCancel}
            className="rounded-xl px-2 py-1 text-xl text-slate-400 transition hover:bg-white/70 hover:text-slate-700"
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
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          />
        </div>

        {/* Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Change Image
          </label>

          <input
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="w-full border border-gray-300 rounded-lg px-3 py-2.5 text-sm"
          />
        </div>

        {/* Dietary Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Dietary Type
          </label>

          <select
            value={dietaryType}
            onChange={(e) => setDietaryType(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          >
            <option value="unknown">Unknown</option>
            <option value="veg">Vegetarian</option>
            <option value="non-veg">Non-Vegetarian</option>
            <option value="vegan">Vegan</option>
          </select>
        </div>

        
        {/* Spice Level */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Taste / Spice Level
          </label>

          <select
            value={spiceLevel}
            onChange={(e) => setSpiceLevel(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
          >
            <option value="unknown">Unknown</option>
            <option value="mild">Mild</option>
            <option value="medium">Medium</option>
            <option value="hot">Hot</option>
            <option value="sweet">Sweet 🍯</option>
          </select>
        </div>


        {/* Preview */}
        {preview && (
          <div className="md:col-span-2">
            <p className="text-sm font-medium text-gray-700 mb-2">
              Image Preview
            </p>

            <img
              src={preview}
              alt="Preview"
              className="w-40 h-32 object-cover rounded-xl border border-gray-200"
            />
          </div>
        )}

        {/* Description */}
        <div className="md:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description
          </label>

          <textarea
            rows="4"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
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
            className="btn-primary px-6 py-3 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Update Menu Item"}
          </button>

          <button
            type="button"
            onClick={onCancel}
            className="btn-secondary px-6 py-3 text-slate-700"
          >
            Cancel
          </button>
        </div>

      </form>
    </div>
  );
}

export default EditMenuForm;
