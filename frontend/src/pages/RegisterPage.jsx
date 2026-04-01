import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { GoogleLogin } from '@react-oauth/google';
import { registerUser, loginUser, googleLogin, getCurrentUser } from "../api/authApi";
import { saveToken } from "../auth/auth";
import { Mail, Lock, User, Briefcase, GraduationCap, ChevronDown, Eye, EyeOff, X } from "lucide-react";
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
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [googleCredential, setGoogleCredential] = useState(null);
  
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    setGoogleCredential(credentialResponse.credential);
    try {
      setIsLoading(true);
      setError("");
      const response = await googleLogin({ credential: credentialResponse.credential });
      const { token, role, needsProfile } = response.data;
      
      saveToken(token);

      const userRes = await getCurrentUser();
      if (userRes?.data?.email) {
        localStorage.setItem("userEmail", userRes.data.email);
      }

      if (needsProfile) {
        navigate("/complete-profile", { state: { role } });
      } else {
        navigate("/");
      }
    } catch (err) {
      if (err?.response?.data?.message?.toLowerCase().includes("role is required")) {
        setShowRoleModal(true);
      } else {
        setError(err?.response?.data?.message || "Google registration failed");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelection = async (selectedRole) => {
    try {
      setIsLoading(true);
      setShowRoleModal(false);
      const response = await googleLogin({ 
        credential: googleCredential, 
        role: selectedRole 
      });
      const { token } = response.data;
      saveToken(token);

      const userRes = await getCurrentUser();
      if (userRes?.data?.email) {
        localStorage.setItem("userEmail", userRes.data.email);
      }

      navigate("/complete-profile", { state: { role: selectedRole } });
    } catch (err) {
      setError(err?.response?.data?.message || "Role selection failed");
    } finally {
      setIsLoading(false);
    }
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
      const loginRes = await loginUser({ email: form.email, password: form.password });
      const token = loginRes?.data?.token;
      if (token) saveToken(token);
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

          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
            <GoogleLogin
              onSuccess={handleGoogleSuccess}
              onError={() => setError("Google Sign up Failed")}
              useOneTap
              theme="filled_blue"
              shape="pill"
              text="signup_with"
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', margin: '1rem 0' }}>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
            <span style={{ margin: '0 10px', color: 'var(--text-muted)', fontSize: '0.8rem' }}>or continue with</span>
            <div style={{ flex: 1, height: '1px', background: 'rgba(255,255,255,0.1)' }}></div>
          </div>

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

      {/* Role Selection Modal */}
      {showRoleModal && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
          backdropFilter: 'blur(10px)', zIndex: 9999, display: 'flex',
          alignItems: 'center', justifyContent: 'center', padding: '1rem'
        }}>
          <div style={{
            background: 'rgba(12,12,25,0.98)', border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '24px', padding: '2.5rem', maxWidth: '400px', width: '100%',
            boxShadow: '0 30px 70px rgba(0,0,0,0.6)', textAlign: 'center'
          }}>
            <h3 style={{ color: 'white', marginBottom: '1.5rem', fontSize: '1.5rem' }}>Select Account Type</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>How will you be using PlacePort?</p>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button
                onClick={() => handleRoleSelection("STUDENT")}
                className="btn-outline-glow w-100"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                  padding: '1rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.03)', color: 'white', fontWeight: '600'
                }}
              >
                <GraduationCap size={20} /> I am a Student
              </button>
              
              <button
                onClick={() => handleRoleSelection("COMPANY")}
                className="btn-outline-glow w-100"
                style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px',
                  padding: '1rem', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.1)',
                  background: 'rgba(255,255,255,0.03)', color: 'white', fontWeight: '600'
                }}
              >
                <Building2 size={20} /> I am a Recruiter
              </button>
            </div>
            
            <button
              onClick={() => setShowRoleModal(false)}
              style={{
                marginTop: '1.5rem', background: 'transparent', border: 'none',
                color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Simple Building icon stub since Building2 is not imported from lucide-react initially
const Building2 = ({ size }) => <Briefcase size={size} />;

export default RegisterPage;