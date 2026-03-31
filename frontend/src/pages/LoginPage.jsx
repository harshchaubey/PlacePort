import { useState } from "react";
import { loginUser, getCurrentUser } from "../api/authApi";
import { saveToken } from "../auth/auth";
import { useNavigate, useLocation } from "react-router-dom";
import { Mail, Lock, GraduationCap } from "lucide-react";
import "./landing.css";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const validateForm = () => {
    if (!email.trim() || !password.trim()) {
      setError("Please enter both email and password.");
      return false;
    }
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
      localStorage.setItem("userEmail", email.trim());

      const userRes = await getCurrentUser();
      const role = userRes?.data?.role;

      const searchParams = new URLSearchParams(location.search);
      const redirectPath = searchParams.get("redirect");
      const applyJobId = searchParams.get("applyJobId");

      if (redirectPath) {
        navigate(`${redirectPath}${applyJobId ? `?applyJobId=${applyJobId}` : ''}`);
      } else if (role === "ADMIN") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (err) {
      console.error("Login error:", err);
      const serverMsg =
        err?.response?.data?.message || err?.message || "Login failed ❌";
      setError(serverMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const isFormInvalid = !email.trim() || !password.trim() || isLoading;

  return (
    <div className="landing-wrapper">
      <div className="landing-bg-glow"></div>
      
      {/* Brand Logo Corner */}
      <div 
        className="brand-logo" 
        style={{ position: 'absolute', top: '2rem', left: '2rem', cursor: 'pointer', zIndex: 100 }}
        onClick={() => navigate("/")}
      >
        <GraduationCap className="text-primary" size={32} />
        PlacePort
      </div>

      <div className="auth-container">
        <div className="auth-card">
          <h2>Welcome Back</h2>

          {error && (
            <div className="alert alert-danger text-center" style={{background: 'rgba(220, 38, 38, 0.2)', color: '#fca5a5', border: '1px solid #ef4444', borderRadius: '12px'}} role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} noValidate>
            <div className="auth-form-group">
              <label htmlFor="email">Email Address</label>
              <div className="auth-input-wrapper">
                <Mail size={18} />
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  autoComplete="email"
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label htmlFor="password">Password</label>
              <div className="auth-input-wrapper">
                <Lock size={18} />
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
              </div>
            </div>

            <button 
              className="btn-gradient w-100 mt-4" 
              style={{ padding: '1rem', fontSize: '1.1rem', borderRadius: '12px' }}
              disabled={isFormInvalid}
            >
              {isLoading ? "Authenticating..." : "Secure Login"}
            </button>
            
            <p className="text-center mt-4" style={{ color: "var(--text-muted)" }}>
              Don't have an account?{" "}
              <span
                style={{ color: "var(--accent)", cursor: "pointer", fontWeight: "600" }}
                onClick={() => navigate(`/register${location.search}`)}
              >
                Sign up
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;