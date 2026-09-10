import { useEffect, useState } from "react";

import AdminNavbar from "../components/AdminNavbar";
import { getDashboardStats } from "../services/dashboardService";

function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadDashboard = async () => {
      try {
        const data = await getDashboardStats();

        if (!ignore) {
          setStats(data.stats);
          setError("");
        }
      } catch (error) {
        console.log("Dashboard Error:", error);

        if (!ignore) {
          setError(
            error.response?.data?.message ||
              "Failed to load dashboard"
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadDashboard();

    return () => {
      ignore = true;
    };
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AdminNavbar />

        <div className="max-w-7xl mx-auto px-5 py-20 text-center">
          <p className="text-gray-500">
            Loading dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-8 md:py-12">

        {/* Header */}
        <div>
          <p className="text-teal-600 font-semibold">
            ADMIN PANEL
          </p>

          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mt-1">
            Dashboard
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your restaurant from one place.
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Stats */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">

            {/* Menu Items */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Total Menu Items
                  </p>

                  <p className="text-4xl font-bold text-gray-900 mt-2">
                    {stats.totalMenuItems}
                  </p>
                </div>

                <div className="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center text-3xl">
                  🍽️
                </div>
              </div>

              <p className="text-sm text-gray-400 mt-5">
                Items currently in your menu
              </p>
            </div>

            {/* Guests */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Total Guests
                  </p>

                  <p className="text-4xl font-bold text-gray-900 mt-2">
                    {stats.totalGuests}
                  </p>
                </div>

                <div className="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center text-3xl">
                  👥
                </div>
              </div>

              <p className="text-sm text-gray-400 mt-5">
                Registered guest accounts
              </p>
            </div>

            {/* Orders */}
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm font-medium">
                    Total Orders
                  </p>

                  <p className="text-4xl font-bold text-gray-900 mt-2">
                    {stats.totalOrders}
                  </p>
                </div>

                <div className="w-14 h-14 bg-teal-50 rounded-xl flex items-center justify-center text-3xl">
                  📦
                </div>
              </div>

              <p className="text-sm text-gray-400 mt-5">
                Orders recorded in the system
              </p>
            </div>

          </div>
        )}

        {/* Quick Actions */}
        <section className="mt-10">

          <h2 className="text-xl font-bold text-gray-900">
            Quick Actions
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5">

            <a
              href="/admin/menu"
              className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-teal-200 transition"
            >
              <div className="text-3xl">🍽️</div>

              <h3 className="font-bold text-gray-900 mt-3">
                Manage Menu
              </h3>

              <p className="text-gray-500 text-sm mt-1">
                Add, edit or remove menu items.
              </p>
            </a>

            <a
              href="/admin/users"
              className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm hover:shadow-md hover:border-teal-200 transition"
            >
              <div className="text-3xl">👥</div>

              <h3 className="font-bold text-gray-900 mt-3">
                Manage Users
              </h3>

              <p className="text-gray-500 text-sm mt-1">
                View and manage registered guests.
              </p>
            </a>

          </div>

        </section>

      </main>
    </div>
  );
}

export default AdminDashboard;