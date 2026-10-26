
import {
  BrowserRouter,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";

import Home from "./pages/Home";
import Menu from "./pages/Menu";
import MenuDetails from "./pages/MenuDetails";
import Cart from "./pages/Cart";

import Login from "./pages/Login";
import Register from "./pages/Register";

import AdminDashboard from "./pages/AdminDashboard";
import AdminMenu from "./pages/AdminMenu";
import AdminUsers from "./pages/AdminUsers";

import ProtectedRoute from "./components/ProtectedRoute";
import Chatbot from "./components/Chatbot";
import { ThemeProvider } from "./components/ThemeProvider";

// Show chatbot only on customer-facing pages
function CustomerChatbot() {
  const { pathname } = useLocation();

  const hideChatbot =
    pathname.startsWith("/admin") ||
    pathname === "/login" ||
    pathname === "/register";

  if (hideChatbot) {
    return null;
  }

  return <Chatbot />;
}

function App() {
  return (
    <ThemeProvider>
    <BrowserRouter>
      <Routes>
        {/* PUBLIC ROUTES */}
        <Route path="/" element={<Home />} />

        <Route path="/menu" element={<Menu />} />

        <Route
          path="/menu/:id"
          element={<MenuDetails />}
        />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        {/* GUEST ROUTES */}
        <Route
          path="/cart"
          element={
            <ProtectedRoute role="guest">
              <Cart />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ROUTES */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/menu"
          element={
            <ProtectedRoute role="admin">
              <AdminMenu />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin/users"
          element={
            <ProtectedRoute role="admin">
              <AdminUsers />
            </ProtectedRoute>
          }
        />
      </Routes>

      {/* AI Chatbot */}
      <CustomerChatbot />
    </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
