import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

function AdminNavbar() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/login");
  };

  const closeMenu = () => {
    setMenuOpen(false);
  };

  return (
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        <div className="h-16 flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/admin"
            onClick={closeMenu}
            className="text-2xl font-bold text-teal-600"
          >
            BiryaniKing 👑
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-7">

            <Link
              to="/admin"
              className="text-gray-700 hover:text-teal-600 transition"
            >
              Dashboard
            </Link>

            <Link
              to="/admin/menu"
              className="text-gray-700 hover:text-teal-600 transition"
            >
              Menu
            </Link>

            <Link
              to="/admin/users"
              className="text-gray-700 hover:text-teal-600 transition"
            >
              Users
            </Link>

            <button
              onClick={handleLogout}
              className="bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700 transition"
            >
              Logout
            </button>

          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-2xl text-gray-700"
            aria-label="Toggle admin menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>

        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">

            <div className="flex flex-col gap-4">

              <Link
                to="/admin"
                onClick={closeMenu}
                className="text-gray-700 hover:text-teal-600"
              >
                Dashboard
              </Link>

              <Link
                to="/admin/menu"
                onClick={closeMenu}
                className="text-gray-700 hover:text-teal-600"
              >
                Menu
              </Link>

              <Link
                to="/admin/users"
                onClick={closeMenu}
                className="text-gray-700 hover:text-teal-600"
              >
                Users
              </Link>

              <button
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
                className="w-full bg-teal-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-teal-700"
              >
                Logout
              </button>

            </div>

          </div>
        )}

      </div>
    </nav>
  );
}

export default AdminNavbar;