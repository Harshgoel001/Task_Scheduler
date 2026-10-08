import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleLogin(e) {
    e.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please enter your email and password.");
      return;
    }

    const user = {
      name: email.split("@")[0],
      email: email,
      avatar: "",
    };

    localStorage.setItem(
      "daily-goals-user",
      JSON.stringify(user)
    );

    navigate("/");
    window.location.reload();
  }

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">✓</div>

        <div className="auth-heading">
          <div className="eyebrow">DAILY GOALS</div>
          <h1>Welcome back</h1>
          <p>Log in to continue planning your day.</p>
        </div>

        <form onSubmit={handleLogin} className="auth-form">
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="auth-button">
            Log In
          </button>
        </form>

        <p className="auth-note">
          Your account is currently stored locally.
        </p>
      </div>
    </div>
  );
}