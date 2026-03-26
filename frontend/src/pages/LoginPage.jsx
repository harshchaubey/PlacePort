import { useState } from "react";
import { loginUser, getCurrentUser } from "../api/authApi";
import { saveToken } from "../auth/auth";
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return false;
    }

    // Basic email format check
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email.trim())) {
      setError("Please enter a valid email address.");
      return false;
    }

    return true;
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    if (!validateForm()) return;

    try {
      setIsLoading(true);

      const response = await loginUser({
        email: email.trim(),
        password: password.trim(),
      });

      const token = response?.data?.token;
      if (!token) throw new Error("Token not received.");

      saveToken(token);

      const userRes = await getCurrentUser();
      const role = userRes?.data?.role;

      if (role === "ADMIN") navigate("/admin");
      else if (role === "COMPANY") navigate("/company");
      else navigate("/student");
    } catch (err) {
      console.error("Login error:", err);

      // Show server message if available
      const serverMsg =
        err?.response?.data?.message || err?.message || "Login failed ❌";
      setError(serverMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormInvalid = !email.trim() || !password.trim() || isLoading;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(to right, #4facfe, #00f2fe)",
      }}
    >
      <h1 className="text-white text-center pt-4 fw-bold">🎓 Placement Portal</h1>

      <div
        className="d-flex justify-content-center align-items-center"
        style={{ height: "80vh" }}
      >
        <div
          className="card shadow p-4"
          style={{ width: "400px", borderRadius: "10px" }}
        >
          <h3 className="text-center mb-4">🔐 Login</h3>

          {error && (
            <div className="alert alert-danger text-center" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} noValidate>
            <div className="mb-3">
              <label htmlFor="email">Email</label>
              <div className="input-group">
                <span className="input-group-text">📧</span>
                <input
                  id="email"
                  type="email"
                  className="form-control"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="password">Password</label>
              <div className="input-group">
                <span className="input-group-text">🔒</span>
                <input
                  id="password"
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button className="btn btn-primary w-100" disabled={isFormInvalid}>
              {isLoading ? "Logging in..." : "Login"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;