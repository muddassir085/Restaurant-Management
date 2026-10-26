import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

function AdminNavbar() {
  const navigate = useNavigate();
  const location = useLocation();
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
    <nav className="glass-nav sticky top-0 z-50 border-b">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">

        <div className="h-16 flex items-center justify-between">

          {/* Logo */}
          <Link
            to="/admin"
            onClick={closeMenu}
            className="rounded-xl text-2xl font-black tracking-tight text-teal-700 transition hover:text-teal-900"
          >
            BiryaniKing 👑
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">

            <Link
              to="/admin"
              className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${location.pathname === "/admin" ? "bg-teal-700 text-white shadow-sm" : "text-slate-700 hover:bg-white/80 hover:text-teal-700"}`}
            >
              Dashboard
            </Link>

            <Link
              to="/admin/menu"
              className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${location.pathname === "/admin/menu" ? "bg-teal-700 text-white shadow-sm" : "text-slate-700 hover:bg-white/80 hover:text-teal-700"}`}
            >
              Menu
            </Link>

            <Link
              to="/admin/users"
              className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${location.pathname === "/admin/users" ? "bg-teal-700 text-white shadow-sm" : "text-slate-700 hover:bg-white/80 hover:text-teal-700"}`}
            >
              Users
            </Link>

            <ThemeToggle />

            <button
              onClick={handleLogout}
              className="btn-primary ml-2 px-4 py-2 text-sm"
            >
              Logout
            </button>

          </div>

          {/* Mobile Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden rounded-xl bg-white/70 px-3 py-2 text-2xl text-slate-700 shadow-sm transition hover:bg-white"
            aria-label="Toggle admin menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>

        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/70 py-4">

            <div className="glass-panel flex flex-col gap-2 rounded-2xl p-3">

              <Link
                to="/admin"
                onClick={closeMenu}
                className={`rounded-xl px-3 py-2 font-semibold ${location.pathname === "/admin" ? "bg-teal-700 text-white" : "text-slate-700 hover:bg-white/80 hover:text-teal-700"}`}
              >
                Dashboard
              </Link>

              <Link
                to="/admin/menu"
                onClick={closeMenu}
                className={`rounded-xl px-3 py-2 font-semibold ${location.pathname === "/admin/menu" ? "bg-teal-700 text-white" : "text-slate-700 hover:bg-white/80 hover:text-teal-700"}`}
              >
                Menu
              </Link>

              <Link
                to="/admin/users"
                onClick={closeMenu}
                className={`rounded-xl px-3 py-2 font-semibold ${location.pathname === "/admin/users" ? "bg-teal-700 text-white" : "text-slate-700 hover:bg-white/80 hover:text-teal-700"}`}
              >
                Users
              </Link>

              <ThemeToggle />

              <button
                onClick={() => {
                  handleLogout();
                  closeMenu();
                }}
                className="btn-primary mt-1 w-full px-4 py-2"
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
