import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { getCart } from "../services/cartService";

function PublicNavbar() {
  const navigate = useNavigate();

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
    <nav className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-5 sm:px-8">
        <div className="h-16 flex items-center justify-between">
          {/* Logo */}
          <Link
            to="/"
            onClick={closeMenu}
            className="group flex items-center gap-2"
          >
            <div className="flex flex-col leading-none">
              <span className="text-3xl sm:text-4xl font-black tracking-tight text-teal-600 group-hover:text-teal-700 transition">
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
          <div className="hidden md:flex items-center gap-7">
            <Link
              to="/"
              className="text-gray-700 hover:text-teal-600 transition"
            >
              Home
            </Link>

            <Link
              to="/menu"
              className="text-gray-700 hover:text-teal-600 transition"
            >
              Menu
            </Link>

            {token && user?.role === "guest" ? (
              <>
                <Link
                  to="/cart"
                  className="text-gray-700 hover:text-teal-600 transition"
                >
                  🛒 Cart
                  {cartCount > 0 && (
                    <span className="ml-1 text-teal-600 font-bold">
                      ({cartCount})
                    </span>
                  )}
                </Link>

                <span className="text-gray-700">Hi, {user.name}</span>

                <button
                  onClick={handleLogout}
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login"
                  className="text-gray-700 hover:text-teal-600 transition"
                >
                  Login
                </Link>

                <Link
                  to="/register"
                  className="bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700 transition"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="md:hidden text-2xl text-gray-700"
            aria-label="Toggle menu"
          >
            {menuOpen ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Navigation */}
        {menuOpen && (
          <div className="md:hidden border-t border-gray-100 py-4">
            <div className="flex flex-col gap-4">
              <Link
                to="/"
                onClick={closeMenu}
                className="text-gray-700 hover:text-teal-600"
              >
                Home
              </Link>

              <Link
                to="/menu"
                onClick={closeMenu}
                className="text-gray-700 hover:text-teal-600"
              >
                Menu
              </Link>

              {token && user?.role === "guest" ? (
                <>
                  <Link
                    to="/cart"
                    onClick={closeMenu}
                    className="text-gray-700 hover:text-teal-600"
                  >
                    🛒 Cart
                    {cartCount > 0 && (
                      <span className="ml-1 text-teal-600 font-bold">
                        ({cartCount})
                      </span>
                    )}
                  </Link>

                  <span className="text-gray-700">Hi, {user.name}</span>

                  <button
                    onClick={() => {
                      handleLogout();
                      closeMenu();
                    }}
                    className="w-full bg-teal-600 text-white px-4 py-2 rounded-lg hover:bg-teal-700"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    onClick={closeMenu}
                    className="text-gray-700 hover:text-teal-600"
                  >
                    Login
                  </Link>

                  <Link
                    to="/register"
                    onClick={closeMenu}
                    className="bg-teal-600 text-white px-4 py-2 rounded-lg text-center hover:bg-teal-700"
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
