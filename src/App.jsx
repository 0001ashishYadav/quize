// src/App.jsx (Updated)
import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Link,
  useNavigate,
} from "react-router";
import Register from "./pages/Register";
import Login from "./pages/Login";
import ProtectedRoute from "./components/ProtectedRoute";
import Quiz from "./pages/Quiz";
import Results from "./pages/Results";
import { Toaster } from "sonner";

const Home = () => {
  const navigate = useNavigate();
  const currentUser = localStorage.getItem("currentUser");

  const handleLogout = () => {
    localStorage.removeItem("currentUser"); // Clear logged-in user
    navigate("/login"); // Redirect to login
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Welcome to the Quiz App!
      </h1>
      {currentUser ? (
        <div className="text-center">
          <p className="text-2xl mb-4">
            Hello,{" "}
            <span className="font-bold text-blue-600">{currentUser}</span>!
          </p>
          <div className="space-x-4">
            <Link
              to="/quiz"
              className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded text-lg"
            >
              Start Quiz
            </Link>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-3 px-6 rounded text-lg"
            >
              Logout
            </button>
          </div>
        </div>
      ) : (
        <div className="space-x-4">
          <Link
            to="/register"
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded text-lg"
          >
            Register
          </Link>
          <Link
            to="/login"
            className="bg-green-500 hover:bg-green-700 text-white font-bold py-3 px-6 rounded text-lg"
          >
            Login
          </Link>
        </div>
      )}
    </div>
  );
};

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}>
          <Route path="/quiz" element={<Quiz />} />
          <Route path="/results" element={<Results />} />
        </Route>
        {/* Any other public routes */}
      </Routes>

      <Toaster
        position="top-center"
        closeButton
        expand={true}
        visibleToasts={3}
      />
    </Router>
  );
}

export default App;
