import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { getCart } from "../services/cartService";
import ThemeToggle from "./ThemeToggle";

function PublicNavbar() {
  const navigate = useNavigate();
  const location = useLocation();

  const token = localStorage.getItem("token");
  const user = JSON.parse(localStorage.getItem("user"));

  const [cartCount, setCartCount] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const fetchCartCount = async () => {
      if (!token || user?.role !== "guest") {
        setCartCount(0);
        return;
      }

      try {
        const data = await getCart();

        const count = data.cart.items.reduce(
          (total, item) => total + item.quantity,
          0,
        );

        setCartCount(count);
      } catch (error) {
        console.log("Cart Count Error:", error);
      }
    };

    fetchCartCount();
  }, [token, user?.role]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    navigate("/");
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
            to="/"
            onClick={closeMenu}
            className="group flex items-center gap-2 rounded-xl"
          >
            <div className="flex flex-col leading-none">
              <span className="text-3xl sm:text-4xl font-black tracking-tight text-teal-700 transition group-hover:text-teal-900">
                BiryaniKing
              </span>

              <span className="text-[9px] sm:text-[10px] font-semibold tracking-[0.25em] text-gray-400 uppercase mt-1">
                Taste the Royal
              </span>
            </div>

            <span className="text-2xl sm:text-3xl group-hover:rotate-12 transition-transform">
              🍗
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/"
              className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${location.pathname === "/" ? "bg-teal-700 text-white shadow-sm" : "text-slate-700 hover:bg-white/80 hover:text-teal-700"}`}
            >
              Home
            </Link>

            <Link
              to="/menu"
              className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${location.pathname.startsWith("/menu") ? "bg-teal-700 text-white shadow-sm" : "text-slate-700 hover:bg-white/80 hover:text-teal-700"}`}
            >
              Menu
            </Link>

            <ThemeToggle />

            {token && user?.role === "guest" ? (
              <>
                <Link
                  to="/cart"
                  className={`rounded-xl px-3 py-2 text-sm font-semibold transition ${location.pathname === "/cart" ? "bg-teal-700 text-white shadow-sm" : "text-slate-700 hover:bg-white/80 hover:text-teal-700"}`}
                >
                  🛒 Cart
                  {cartCount > 0 && (
                    <span className="ml-1 text-teal-600 font-bold">
                      ({cartCount})
                    </span>
                  )}
                </Link>

                <span className="hidden rounded-xl bg-white/65 px-3 py-2 text-sm font-medium text-slate-700 lg:inline">Hi, {user.name}</span>

                <button
                  onClick={handleLogout}
                  className="btn-primary px-4 py-2 text-sm"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="rounded-xl px-3 py-2 text-sm font-semibold text-slate-700 transition hover:bg-white/80 hover:text-teal-700"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="btn-primary px-4 py-2 text-sm"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden rounded-xl bg-white/70 px-3 py-2 text-2xl text-slate-700 shadow-sm transition hover:bg-white"
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden border-t border-white/70 py-4">
            <div className="glass-panel flex flex-col gap-2 rounded-2xl p-3">
              <Link
                to="/"
                onClick={closeMenu}
                className={`rounded-xl px-3 py-2 font-semibold ${location.pathname === "/" ? "bg-teal-700 text-white" : "text-slate-700 hover:bg-white/80 hover:text-teal-700"}`}
              >
                Home
              </Link>

              <Link
                to="/menu"
                onClick={closeMenu}
                className={`rounded-xl px-3 py-2 font-semibold ${location.pathname.startsWith("/menu") ? "bg-teal-700 text-white" : "text-slate-700 hover:bg-white/80 hover:text-teal-700"}`}
              >
                Menu
              </Link>

              <ThemeToggle />

              {token && user?.role === "guest" ? (
                <>
                  <Link
                    to="/cart"
                    onClick={closeMenu}
                    className={`rounded-xl px-3 py-2 font-semibold ${location.pathname === "/cart" ? "bg-teal-700 text-white" : "text-slate-700 hover:bg-white/80 hover:text-teal-700"}`}
                  >
                    🛒 Cart
                    {cartCount > 0 && (
                      <span className="ml-1 text-teal-600 font-bold">
                        ({cartCount})
                      </span>
                    )}
                  </Link>

                  <span className="px-3 py-2 text-sm font-medium text-slate-700">Hi, {user.name}</span>

                  <button
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                    className="btn-primary mt-1 w-full px-4 py-2"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="rounded-xl px-3 py-2 font-semibold text-slate-700 hover:bg-white/80 hover:text-teal-700"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="btn-primary mt-1 px-4 py-2"
                  >
                    Register
                  </Link>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

export default PublicNavbar;
