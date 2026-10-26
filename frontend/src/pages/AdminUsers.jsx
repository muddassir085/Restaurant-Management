import { useEffect, useState } from "react";

import AdminNavbar from "../components/AdminNavbar";
import {
  getUsers,
  deleteUser,
} from "../services/userService";

function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let ignore = false;

    const loadUsers = async () => {
      try {
        const data = await getUsers();

        if (!ignore) {
          setUsers(data.users);
          setError("");
        }
      } catch (error) {
        console.log("Users Error:", error);

        if (!ignore) {
          setError(
            error.response?.data?.message ||
              "Failed to load users"
          );
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    };

    loadUsers();

    return () => {
      ignore = true;
    };
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this guest?"
    );

    if (!confirmed) return;

    try {
      await deleteUser(id);

      setUsers((prevUsers) =>
        prevUsers.filter((user) => user._id !== id)
      );

      setError("");
    } catch (error) {
      console.log("Delete User Error:", error);

      setError(
        error.response?.data?.message ||
          "Failed to delete user"
      );
    }
  };

  return (
    <div className="app-shell min-h-screen">
      <AdminNavbar />

      <main className="max-w-7xl mx-auto px-5 sm:px-8 py-8 md:py-12">

        {/* Header */}
        <div>
          <p className="eyebrow">
            ADMIN PANEL
          </p>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 mt-1">
            Manage Users
          </h1>

          <p className="text-gray-500 mt-2">
            View and manage registered guests.
          </p>
        </div>

        {/* User Count */}
        {!loading && (
          <div className="glass-panel mt-6 inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-teal-700">
            👥 {users.length}{" "}
            {users.length === 1 ? "User" : "Users"}
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="mt-6 bg-red-50 border border-red-100 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div className="text-center py-20">
            <p className="text-gray-500">
              Loading users...
            </p>
          </div>
        ) : users.length === 0 ? (
          /* Empty */
          <div className="glass-panel mt-8 rounded-3xl py-16 text-center">

            <div className="text-6xl">
              👥
            </div>

            <h2 className="text-2xl font-bold text-gray-900 mt-4">
              No users found
            </h2>

            <p className="text-gray-500 mt-2">
              There are no registered guests yet.
            </p>

          </div>
        ) : (
          <>
            {/* Desktop Table */}
            <div className="glass-panel hidden md:block overflow-hidden rounded-3xl mt-8">

              <div className="overflow-x-auto">

                <table className="w-full">

                  <thead className="bg-white/65 border-b border-white/80">
                    <tr>
                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                        User
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                        Email
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                        Role
                      </th>

                      <th className="text-left px-6 py-4 text-sm font-semibold text-gray-600">
                        Joined
                      </th>

                      <th className="text-right px-6 py-4 text-sm font-semibold text-gray-600">
                        Action
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-gray-100">

                    {users.map((user) => (
                      <tr
                        key={user._id}
                        className="transition hover:bg-white/65"
                      >

                        {/* User */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-3">

                            <div className="w-10 h-10 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                              {user.name
                                ?.charAt(0)
                                .toUpperCase()}
                            </div>

                            <span className="font-medium text-gray-900">
                              {user.name}
                            </span>

                          </div>
                        </td>

                        {/* Email */}
                        <td className="px-6 py-4 text-gray-600">
                          {user.email}
                        </td>

                        {/* Role */}
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex px-3 py-1 rounded-full text-xs font-semibold ${
                              user.role === "admin"
                                ? "bg-purple-100 text-purple-700"
                                : "bg-teal-50 text-teal-700"
                            }`}
                          >
                            {user.role}
                          </span>
                        </td>

                        {/* Joined */}
                        <td className="px-6 py-4 text-gray-500">
                          {new Date(
                            user.createdAt
                          ).toLocaleDateString()}
                        </td>

                        {/* Action */}
                        <td className="px-6 py-4 text-right">

                          {user.role === "guest" ? (
                            <button
                              onClick={() =>
                                handleDelete(user._id)
                              }
                              className="text-red-600 font-medium hover:text-red-700 hover:underline"
                            >
                              Delete
                            </button>
                          ) : (
                            <span className="text-gray-400 text-sm">
                              Protected
                            </span>
                          )}

                        </td>

                      </tr>
                    ))}

                  </tbody>

                </table>

              </div>
            </div>

            {/* Mobile Cards */}
            <div className="md:hidden space-y-4 mt-8">

              {users.map((user) => (
                <div
                  key={user._id}
                  className="glass-card rounded-2xl p-5"
                >

                  <div className="flex items-center justify-between gap-4">

                    <div className="flex items-center gap-3">

                      <div className="w-11 h-11 rounded-full bg-teal-50 text-teal-700 flex items-center justify-center font-bold">
                        {user.name
                          ?.charAt(0)
                          .toUpperCase()}
                      </div>

                      <div>
                        <h2 className="font-bold text-gray-900">
                          {user.name}
                        </h2>

                        <p className="text-sm text-gray-500 break-all">
                          {user.email}
                        </p>
                      </div>

                    </div>

                    <span
                      className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-700"
                          : "bg-teal-50 text-teal-700"
                      }`}
                    >
                      {user.role}
                    </span>

                  </div>

                  <div className="border-t border-gray-100 mt-5 pt-4 flex items-center justify-between">

                    <div>
                      <p className="text-xs text-gray-400">
                        Joined
                      </p>

                      <p className="text-sm text-gray-600 mt-1">
                        {new Date(
                          user.createdAt
                        ).toLocaleDateString()}
                      </p>
                    </div>

                    {user.role === "guest" ? (
                      <button
                        onClick={() =>
                          handleDelete(user._id)
                        }
                        className="text-red-600 font-medium hover:text-red-700"
                      >
                        Delete
                      </button>
                    ) : (
                      <span className="text-gray-400 text-sm">
                        Protected
                      </span>
                    )}

                  </div>

                </div>
              ))}

            </div>
          </>
        )}

      </main>
    </div>
  );
}

export default AdminUsers;
