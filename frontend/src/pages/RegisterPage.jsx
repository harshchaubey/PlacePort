import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { registerUser } from "../api/authApi";
import { Mail, Lock, User, Briefcase, GraduationCap, ChevronDown, Eye, EyeOff } from "lucide-react";
import "./landing.css";

function RegisterPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({
    email: "",
    password: "",
    role: ""
  });
  
  const [showPassword, setShowPassword] = useState(false);
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    
    if (!form.email || !form.password || !form.role) {
        setError("Please fill in all fields to continue.");
        return;
    }

    const emailRegex = /^[^\s@]+@gmail\.com$/i;
    if (!emailRegex.test(form.email)) {
        setError("Please enter a valid @gmail.com email address.");
        return;
    }

    try {
      setIsLoading(true);
      await registerUser(form);
      localStorage.setItem("userEmail", form.email);
      navigate("/complete-profile", { state: { role: form.role } });
    } catch (err) {
      setError(err?.response?.data?.message || err?.message || "Registration failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
          <h2>Create Account</h2>

          {error && (
            <div className="alert alert-danger text-center" style={{background: 'rgba(220, 38, 38, 0.2)', color: '#fca5a5', border: '1px solid #ef4444', borderRadius: '12px'}} role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleRegister} noValidate>
            <div className="auth-form-group">
              <label>Email Address</label>
              <div className="auth-input-wrapper">
                <Mail size={18} />
                <input
                  type="email"
                  name="email"
                  placeholder="name@gmail.com"
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="auth-form-group">
              <label>Password</label>
              <div className="auth-input-wrapper" style={{ position: 'relative' }}>
                <Lock size={18} />
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Create a strong password"
                  onChange={handleChange}
                  required
                />
                <div 
                  onClick={() => setShowPassword(!showPassword)}
                  style={{ position: 'absolute', right: '1rem', cursor: 'pointer', color: 'var(--text-muted)' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </div>
              </div>
            </div>

            <div className="auth-form-group">
              <label>Account Type</label>
              <div className="auth-input-wrapper" style={{ position: 'relative' }}>
                <User size={18} />
                <select
                  name="role"
                  onChange={handleChange}
                  required
                >
                  <option value="" disabled selected>Select Role</option>
                  <option value="STUDENT">Student Candidate</option>
                  <option value="COMPANY">Hiring Company</option>
                </select>
                <ChevronDown size={18} style={{ position: 'absolute', right: '1rem', color: 'var(--text-muted)' }} />
              </div>
            </div>

            <button 
              className="btn-gradient w-100 mt-4" 
              style={{ padding: '1rem', fontSize: '1.1rem', borderRadius: '12px' }}
              disabled={isLoading}
            >
              {isLoading ? "Creating Account..." : "Join PlacePort"}
            </button>
            
            <p className="text-center mt-4" style={{ color: "var(--text-muted)" }}>
              Already registered?{" "}
              <span
                style={{ color: "var(--accent)", cursor: "pointer", fontWeight: "600" }}
                onClick={() => navigate(`/login${location.search}`)}
              >
                Log in
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;