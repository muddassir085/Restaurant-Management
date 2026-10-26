import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../services/authService";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    try {
      const data = await loginUser(email, password);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      if (data.user.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.log("Login Error:", error);

      setError(error.response?.data?.message || "Invalid email or password");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="app-shell relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10">
      <div className="absolute -left-24 top-12 h-64 w-64 rounded-full bg-amber-300/20 blur-3xl" />
      <div className="absolute -right-24 bottom-12 h-72 w-72 rounded-full bg-teal-300/20 blur-3xl" />

      <div className="page-enter relative w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-7">
          <Link
            to="/"
            className="inline-block text-4xl sm:text-5xl font-black tracking-tight text-teal-700 transition-all duration-300 ease-out hover:scale-110 hover:text-teal-600 hover:drop-shadow-md active:scale-95"
          >
            BiryaniKing <span>🍗</span>
          </Link>

          <p className="text-gray-500 mt-2">Welcome back! Login to continue.</p>
        </div>

        {/* Card */}
        <div className="glass-panel rounded-3xl p-6 sm:p-8">
          <h1 className="text-2xl font-black tracking-tight text-slate-900">
            Login
          </h1>

          <p className="text-gray-500 text-sm mt-1">
            Enter your account details
          </p>

          <form onSubmit={handleSubmit} className="space-y-5 mt-7">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email
              </label>

              <input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>

              <input
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full border border-gray-300 rounded-lg px-4 py-3 outline-none focus:border-teal-500 focus:ring-2 focus:ring-teal-100"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="bg-red-50 border border-red-100 text-red-600 text-sm px-4 py-3 rounded-lg">
                {error}
              </div>
            )}

            {/* Button */}
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-3 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Register */}
          <p className="text-center text-gray-600 text-sm mt-7">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="text-teal-600 font-semibold hover:underline"
            >
              Create Account
            </Link>
          </p>
        </div>

        {/* Back Home */}
        <div className="text-center mt-5">
          <Link to="/" className="text-sm text-gray-500 hover:text-teal-600">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
