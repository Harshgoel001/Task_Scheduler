import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./Components/Navbar";
import Dashboard from "./pages/Dashboard";
import Events from "./pages/Events";
import Login from "./pages/Login";
import Profile from "./pages/Profile";

function App() {
  const isLoggedIn = localStorage.getItem("daily-goals-user");

  return (
    <>
      {isLoggedIn && <Navbar />}

      <Routes>
        <Route
          path="/login"
          element={
            isLoggedIn ? <Navigate to="/" replace /> : <Login />
          }
        />

        <Route
          path="/"
          element={
            isLoggedIn ? <Dashboard /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/events"
          element={
            isLoggedIn ? <Events /> : <Navigate to="/login" replace />
          }
        />

        <Route
          path="/profile"
          element={
            isLoggedIn ? <Profile /> : <Navigate to="/login" replace />
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}

export default App;